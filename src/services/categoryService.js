import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { validateCategory, normalizeText } from "../utils/categoryValidation";
import { getCache, setCache, clearCache } from "../utils/memoryCache";

const COLLECTION = "categories";
const CACHE_KEY_CATEGORIES = "all_categories";

export async function getCategories() {
  const cached = getCache(CACHE_KEY_CATEGORIES);
  if (cached) return cached;

  const q = query(collection(db, COLLECTION), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setCache(CACHE_KEY_CATEGORIES, data);
  return data;
}

/**
 * Devuelve solo categorías principales (parentId == null o no existe).
 */
export async function getParentCategories() {
  const all = await getCategories();
  return all.filter((c) => !c.parentId);
}

/**
 * Devuelve las categorías principales con sus subcategorías anidadas.
 * Formato: [{ ...cat, subcategories: [{ ...sub }] }]
 * Las categorías sin hijos tienen subcategories: []
 */
export async function getCategoriesGrouped() {
  const all = await getCategories();
  const parents = all.filter((c) => !c.parentId);
  return parents.map((parent) => ({
    ...parent,
    subcategories: all.filter((c) => c.parentId === parent.id),
  }));
}

export async function getCategoryById(id) {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createCategory(data, userId) {
  const { valid, errors, sanitized } = validateCategory(data);
  if (!valid) throw new ValidationError(errors);

  // Permitir duplicados de nombre solo si tienen distinto padre
  const duplicate = await checkDuplicateName(sanitized.name, null, data.parentId ?? null);
  if (duplicate) throw new Error("DUPLICATE_NAME");

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...sanitized,
    parentId: data.parentId ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: userId,
    updatedBy: userId,
  });

  clearCache();

  return { id: docRef.id, ...sanitized, parentId: data.parentId ?? null };
}

export async function updateCategory(id, data, userId) {
  const { valid, errors, sanitized } = validateCategory(data);
  if (!valid) throw new ValidationError(errors);

  const duplicate = await checkDuplicateName(sanitized.name, id, data.parentId ?? null);
  if (duplicate) throw new Error("DUPLICATE_NAME");

  await updateDoc(doc(db, COLLECTION, id), {
    ...sanitized,
    parentId: data.parentId ?? null,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });

  clearCache();
}

export async function toggleCategoryStatus(id, newStatus, userId) {
  if (newStatus !== "active" && newStatus !== "inactive") {
    throw new Error("INVALID_STATUS");
  }
  await updateDoc(doc(db, COLLECTION, id), {
    status: newStatus,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });

  clearCache();
}

export async function deleteCategory(id) {
  // Verificar que no tenga productos asociados
  const productsSnap = await getDocs(
    query(collection(db, "products"), where("categoryId", "==", id))
  );
  if (!productsSnap.empty) {
    throw new Error("CATEGORY_IN_USE");
  }
  // Verificar que no tenga subcategorías hijas
  const childSnap = await getDocs(
    query(collection(db, COLLECTION), where("parentId", "==", id))
  );
  if (!childSnap.empty) {
    throw new Error("CATEGORY_HAS_CHILDREN");
  }
  await deleteDoc(doc(db, COLLECTION, id));

  clearCache();
}

/**
 * Verifica nombre duplicado dentro del mismo nivel (mismo parentId).
 * Permite el mismo nombre si están en distintos padres.
 */
async function checkDuplicateName(name, excludeId, parentId = null) {
  const all = await getCategories();
  const normalized = normalizeText(name);
  const match = all.find((c) => {
    if (excludeId && c.id === excludeId) return false;
    const sameParent = (c.parentId ?? null) === (parentId ?? null);
    return sameParent && normalizeText(c.name) === normalized;
  });
  return !!match;
}

export class ValidationError extends Error {
  constructor(errors) {
    super("VALIDATION_ERROR");
    this.name = "ValidationError";
    this.fieldErrors = errors;
  }
}
