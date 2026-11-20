/**
 * BrandLogo — Componente oficial del logotipo de Casa Karem.
 *
 * Utiliza el logo circular oficial con fondo exterior transparente:
 * /logo-casa-karem-circulo.webp (716x716 px)
 *
 * Muestra el emblema circular completo con el monograma dorado "CK"
 * y el texto oficial "CASA KAREM" integrado con proporciones profesionales
 * y sin recortes.
 */

import { Link } from "react-router-dom";
import { BRAND } from "../../config/brand";

/**
 * @param {"sm"|"md"|"lg"|"footer"|"auth"|"sidebar-collapsed"|"none"} size
 * @param {string} className Clases adicionales para el contenedor
 * @param {boolean} noLink Si true, no envuelve en <Link>
 * @param {string} to Ruta de navegación (por defecto "/")
 * @param {boolean} dark Si true, adapta textos para fondos oscuros (footer)
 * @param {boolean} onlyIcon Si true, omite el texto "CASA KAREM" al lado
 * @param {boolean} noIcon Si true, omite el emblema y muestra solo el texto
 * @param {boolean} goldText Si true, aplica tipografía dorada metálica elegante
 * @param {string} textClassName Clases adicionales para el texto
 */
export default function BrandLogo({
  size = "md",
  className = "",
  noLink = false,
  to = "/",
  dark = false,
  onlyIcon = false,
  noIcon = false,
  goldText = false,
  textClassName = "",
}) {
  const isOnlyIcon = onlyIcon || size === "sidebar-collapsed";
  const isAuth = size === "auth";

  // Dimensiones profesionales para el medallón circular sin fondo exterior
  const emblemContainerClasses = isAuth
    ? "w-28 h-28 sm:w-32 sm:h-32 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-xl"
    : size === "footer"
    ? "w-16 h-16 sm:w-[70px] sm:h-[70px] shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
    : size === "sm"
    ? "w-9 h-9 sm:w-11 sm:h-11 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
    : size === "sidebar-collapsed"
    ? "w-11 h-11 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
    : "w-10 h-10 sm:w-12 sm:h-12 lg:w-[64px] lg:h-[64px] shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-md";

  const emblem = (
    <div className={emblemContainerClasses}>
      <img
        src="/logo-casa-karem-circulo.webp"
        alt="Casa Karem"
        loading="eager"
        width={160}
        height={160}
        className="h-full w-full object-contain select-none pointer-events-none [image-rendering:-webkit-optimize-contrast]"
        draggable={false}
      />
    </div>
  );

  const content = (
    <div className={`inline-flex items-center gap-2 sm:gap-3 shrink-0 select-none min-w-0 ${className}`}>
      {!noIcon && emblem}

      {!isOnlyIcon && (
        <div className="flex flex-col leading-none select-none justify-center whitespace-nowrap min-w-0 flex-shrink">
          <span
            className={[
              "uppercase transition-all duration-300 select-none tracking-[0.16em] [text-rendering:optimizeLegibility]",
              size === "footer"
                ? "text-xl sm:text-2xl font-bold"
                : size === "sm"
                ? "text-sm sm:text-lg font-bold"
                : "text-base sm:text-xl lg:text-2xl font-extrabold",
              goldText
                ? "bg-gradient-to-r from-[#8C6010] via-[#D4AF37] to-[#8C6010] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(140,96,16,0.18)] group-hover:brightness-110"
                : dark
                ? "text-white font-bold"
                : "text-[#2b050d] font-bold",
              textClassName,
            ].filter(Boolean).join(" ")}
          >
            Casa Karem
          </span>
        </div>
      )}
    </div>
  );

  if (noLink) return content;

  return (
    <Link
      to={to}
      aria-label="Casa Karem"
      className="group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full transition-opacity hover:opacity-95"
    >
      {content}
    </Link>
  );
}
