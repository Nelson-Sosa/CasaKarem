import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop: restaura el scroll al inicio al cambiar de ruta.
 * Solo reacciona a cambios en pathname (ignora ?search y #hash).
 * Colocar dentro de <BrowserRouter>, antes de <Routes>.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Si el pathname cambió y no hay hash, scrollear al inicio
    if (prevPathname.current !== pathname && !hash) {
      window.scrollTo(0, 0);
    }
    prevPathname.current = pathname;
  }, [pathname, hash]);

  return null;
}
