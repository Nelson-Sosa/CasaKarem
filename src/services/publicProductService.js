import { collection, getDocs, query, where, orderBy, limit, startAfter, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getCache, setCache } from "../utils/memoryCache";

const PRODUCTS_COLLECTION = "products";
const CATEGORIES_COLLECTION = "categories";
const PAGE_SIZE = 30;

// Claves de caché para este servicio
const CACHE_ACTIVE_PRODUCTS = "active_products";
const CACHE_CATEGORIES = "pub_categories";

/**
 * Transforma un documento de Firestore a una representación pública autorizada.
 * Utiliza una whitelist estricta con los atributos necesarios para el catálogo,
 * detalle, búsqueda, filtrado y carrito.
 * Excluye rigurosamente `purchasePrice` y metadatos administrativos internos.
 */
function toPublicProduct(id, data, categoryName, subcategoryName) {
  if (!data) return null;
  return {
    id,
    name: data.name || "",
    description: data.description || "",
    salePrice: Number(data.salePrice) || 0,
    offerPrice: data.offerPrice != null ? Number(data.offerPrice) : null,
    originalPrice: data.originalPrice != null ? Number(data.originalPrice) : null,
    images: Array.isArray(data.images) ? data.images : [],
    categoryId: data.categoryId || "",
    categoryName: categoryName || "Sin categoría",
    subcategoryId: data.subcategoryId || null,
    subcategoryName: subcategoryName || null,
    sku: data.sku || "",
    stock: Number(data.stock) || 0,
    brand: data.brand || "",
    status: data.status || "active",
    isOnSale: Boolean(data.isOnSale),
    isBestSeller: Boolean(data.isBestSeller),
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    attributes: Array.isArray(data.attributes) ? data.attributes : [],
    createdAt: data.createdAt || null,
  };
}

/**
 * Obtiene y devuelve el mapeo de categorías (con caché en memoria).
 * Función interna reutilizada por las funciones públicas.
 */
async function getCatMap() {
  const cached = getCache(CACHE_CATEGORIES);
  if (cached) return cached;

  const catSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
  const catMap = Object.fromEntries(catSnap.docs.map((d) => [d.id, d.data().name]));
  setCache(CACHE_CATEGORIES, catMap);
  return catMap;
}

export async function getActiveProducts() {
  // Intentar servir desde caché
  const cached = getCache(CACHE_ACTIVE_PRODUCTS);
  if (cached) return cached;

  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy("name", "asc")
  );
  const snapshot = await getDocs(q);
  const catMap = await getCatMap();

  const products = snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();
      const categoryName = catMap[data.categoryId] || "Sin categoría";
      const subcategoryName = data.subcategoryId ? (catMap[data.subcategoryId] || null) : null;
      return toPublicProduct(docSnap.id, data, categoryName, subcategoryName);
    })
    .filter((p) => p && p.status === "active");

  setCache(CACHE_ACTIVE_PRODUCTS, products);
  return products;
}

export function subscribeToActiveProducts(onData, onError) {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy("name", "asc")
  );

  return onSnapshot(
    q,
    async (snapshot) => {
      try {
        const catMap = await getCatMap();

        const products = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            const categoryName = catMap[data.categoryId] || "Sin categoría";
            const subcategoryName = data.subcategoryId ? (catMap[data.subcategoryId] || null) : null;
            return toPublicProduct(docSnap.id, data, categoryName, subcategoryName);
          })
          .filter((p) => p && p.status === "active");

        onData(products);
      } catch (err) {
        if (onError) onError(err);
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export async function getActiveProductById(id) {
  // Intentar servir desde caché individual
  const cacheKey = `product_${id}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
  if (!snap.exists()) return null;
  const rawData = snap.data();
  if (rawData.status !== "active") return null;

  const catMap = await getCatMap();
  const categoryName = catMap[rawData.categoryId] || "Sin categoría";
  const subcategoryName = rawData.subcategoryId ? (catMap[rawData.subcategoryId] || null) : null;

  const product = toPublicProduct(snap.id, rawData, categoryName, subcategoryName);
  setCache(cacheKey, product);
  return product;
}

/**
 * Obtiene productos activos con paginación eficiente usando cursores de Firestore.
 * IMPORTANTE: Esta función requiere índices compuestos en Firestore.
 * Los índices se crean automáticamente al hacer clic en el enlace que Firebase proporciona en consola.
 * 
 * @param {Object} options - Opciones de paginación y filtrado
 * @param {string} options.sortBy - Campo de ordenamiento ('createdAt', 'salePrice', 'name')
 * @param {string} options.sortDirection - Dirección ('asc' o 'desc')
 * @param {DocumentSnapshot} options.lastDoc - Último documento de la página anterior (para cursor)
 * @param {number} options.pageSize - Cantidad de productos por página (default: 30)
 * @returns {Promise<{products: Array, hasMore: boolean, lastVisible: DocumentSnapshot}>}
 */
export async function getActiveProductsPaginated({
  sortBy = "createdAt",
  sortDirection = "desc",
  lastDoc = null,
  pageSize = PAGE_SIZE
}) {
  try {
    // Obtener mapeo de categorías (con caché en memoria)
    const catMap = await getCatMap();

    // Construir query base con filtro de productos activos
    let q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("status", "==", "active"),
      orderBy(sortBy, sortDirection),
      limit(pageSize + 1) // +1 para detectar si hay más páginas
    );

    // Si hay cursor, continuamos desde el último documento
    if (lastDoc) {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        where("status", "==", "active"),
        orderBy(sortBy, sortDirection),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    // Detectar si hay más páginas
    const hasMore = docs.length > pageSize;
    const productsToShow = hasMore ? docs.slice(0, pageSize) : docs;

    // Transformar documentos a productos públicos
    const products = productsToShow
      .map((docSnap) => {
        const data = docSnap.data();
        const categoryName = catMap[data.categoryId] || "Sin categoría";
        const subcategoryName = data.subcategoryId ? (catMap[data.subcategoryId] || null) : null;
        return toPublicProduct(docSnap.id, data, categoryName, subcategoryName);
      })
      .filter((p) => p !== null);

    // Guardar referencia al último documento visible
    const lastVisible = productsToShow.length > 0 
      ? productsToShow[productsToShow.length - 1] 
      : null;

    return {
      products,
      hasMore,
      lastVisible,
      totalFetched: products.length
    };
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    throw error;
  }
}

/**
 * Cuenta el total de productos activos (para mostrar "X de Y resultados")
 */
export async function countActiveProducts() {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("status", "==", "active")
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error counting products:", error);
    return 0;
  }
}
