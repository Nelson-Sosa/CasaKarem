export function getImageUrl(image) {
  if (typeof image === "string") return optimizeCloudinaryUrl(image);
  if (image instanceof File) return URL.createObjectURL(image);
  if (image && typeof image === "object" && image.url) return optimizeCloudinaryUrl(image.url);
  return null;
}

export function isFile(image) {
  return image instanceof File;
}

export function isStoredImage(image) {
  return typeof image === "string" || (image && typeof image === "object" && image.url);
}

/**
 * Optimiza URLs de Cloudinary inyectando f_auto,q_auto para servir
 * formatos modernos (WebP/AVIF) y compresión inteligente desde la CDN.
 *
 * @param {string} url - URL original de la imagen
 * @returns {string} URL optimizada
 */
export function optimizeCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("f_auto") || url.includes("q_auto")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto/");
}
