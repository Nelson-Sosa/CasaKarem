/**
 * memoryCache.js — Caché en memoria para la sesión actual
 *
 * Almacena resultados de consultas frecuentes a Firestore en un Map de RAM.
 * El TTL por defecto es de 5 minutos. Al expirar, la próxima solicitud
 * vuelve a consultar Firestore y renueva la entrada.
 *
 * Claves estándar:
 *   'active_products'   → listado público de productos activos
 *   'categories'        → todas las categorías
 *   'business_settings' → configuración de negocio (WhatsApp, nombre, etc.)
 *   `product_${id}`     → producto individual por ID
 */

const cache = new Map();
const TTL_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene un valor del caché si existe y no ha expirado.
 * @param {string} key
 * @returns {*|null} El dato cacheado o null si no existe / expiró
 */
export function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Guarda un valor en el caché con timestamp actual.
 * @param {string} key
 * @param {*} data
 */
export function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Elimina una o todas las entradas del caché.
 * Llamar sin argumentos para limpiar todo (ej: tras operaciones de escritura del admin).
 * Llamar con una clave específica para invalidar solo esa entrada.
 * @param {string|null} key - Clave específica o null para limpiar todo
 */
export function clearCache(key = null) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Retorna el número de entradas activas en el caché (útil para debugging).
 * @returns {number}
 */
export function getCacheSize() {
  return cache.size;
}
