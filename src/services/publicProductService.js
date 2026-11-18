import { collection, getDocs, query, where, orderBy, limit, startAfter, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const PRODUCTS_COLLECTION = "products";
const CATEGORIES_COLLECTION = "categories";
const PAGE_SIZE = 30;

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
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    attributes: Array.isArray(data.attributes) ? data.attributes : [],
    createdAt: data.createdAt || null,
  };
}

export async function getActiveProducts() {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy("name", "asc")
  );
  const snapshot = await getDocs(q);

  const catSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
  const catMap = Object.fromEntries(
    catSnap.docs.map((d) => [d.id, d.data().name])
  );

  return snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();
      const categoryName = catMap[data.categoryId] || "Sin categoría";
      const subcategoryName = data.subcategoryId ? (catMap[data.subcategoryId] || null) : null;
      return toPublicProduct(docSnap.id, data, categoryName, subcategoryName);
    })
    .filter((p) => p && p.status === "active");
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
        const catSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
        const catMap = Object.fromEntries(
          catSnap.docs.map((d) => [d.id, d.data().name])
        );

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
  const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));
  if (!snap.exists()) return null;
  const rawData = snap.data();
  if (rawData.status !== "active") return null;

  let categoryName = "Sin categoría";
  let subcategoryName = null;
  if (rawData.categoryId) {
    const catSnap = await getDoc(doc(db, CATEGORIES_COLLECTION, rawData.categoryId));
    if (catSnap.exists()) categoryName = catSnap.data().name;
  }
  if (rawData.subcategoryId) {
    const subSnap = await getDoc(doc(db, CATEGORIES_COLLECTION, rawData.subcategoryId));
    if (subSnap.exists()) subcategoryName = subSnap.data().name;
  }

  return toPublicProduct(snap.id, rawData, categoryName, subcategoryName);
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
    // Obtener mapeo de categorías una vez
    const catSnap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const catMap = Object.fromEntries(
      catSnap.docs.map((d) => [d.id, d.data().name])
    );

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
