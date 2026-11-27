import { lazy } from "react";

const CHUNK_RELOAD_KEY = "ck_chunk_reload_at";
const RELOAD_COOLDOWN_MS = 10000;

/**
 * Envuelve React.lazy con un reintento automático en memoria y, si persiste
 * (por ejemplo tras un deploy mientras la pestaña estaba en segundo plano),
 * recarga una única vez de forma segura antes de delegar al ErrorBoundary.
 */
export default function lazyWithRetry(importer) {
  return lazy(async () => {
    try {
      return await importer();
    } catch (firstError) {
      // Breve espera y un reintento por micro-cortes de red móvil
      await new Promise((resolve) => setTimeout(resolve, 350));
      try {
        return await importer();
      } catch {
        const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
        const now = Date.now();
        if (now - lastReload > RELOAD_COOLDOWN_MS) {
          sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
          window.location.reload();
          // Evitar flash de error mientras el navegador recarga
          return new Promise(() => {});
        }
        throw firstError;
      }
    }
  });
}
