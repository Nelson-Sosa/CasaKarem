import { Component } from "react";

const CHUNK_RELOAD_KEY = "ck_chunk_reload_at";
const RELOAD_COOLDOWN_MS = 10000;

function isChunkLoadError(error) {
  const msg = String(error?.message || error || "");
  return (
    error?.name === "ChunkLoadError" ||
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed") ||
    msg.includes("error loading dynamically imported module")
  );
}

/**
 * ErrorBoundary global para evitar pantallas en blanco ante errores de render
 * o fallos al descargar chunks dinámicos tras un deploy o micro-corte de red.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (isChunkLoadError(error)) {
      const lastReload = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0);
      const now = Date.now();
      if (now - lastReload > RELOAD_COOLDOWN_MS) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
          <h1 className="text-lg font-bold text-gray-900">
            No pudimos cargar esta página
          </h1>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Ocurrió un problema temporal de conexión o una actualización reciente de la tienda.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-[#E30613] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c70510]"
            >
              Recargar página
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = "/catalogo";
              }}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Ir al catálogo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
