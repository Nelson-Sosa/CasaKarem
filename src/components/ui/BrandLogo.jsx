/**
 * BrandLogo — Componente oficial del logotipo de Casa Karem.
 *
 * Utiliza el logo circular oficial con fondo exterior transparente:
 * /logo-casa-karem-circulo.webp (716x716 px)
 *
 * Muestra el emblema circular con el monograma "CK", el texto "CASA KAREM",
 * la línea comercial "ELECTRÓNICA - PERFUMERÍA" y la trayectoria
 * "Desde [Paraguay, Argentina, Brasil] 1992" con banderas oficiales vectoriales (SVG).
 */

import { Link } from "react-router-dom";

/** Banderas oficiales vectoriales (compatibles con todos los navegadores y sistemas) */
function ParaguayFlag({ className = "" }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={`shrink-0 overflow-hidden ${className}`}
      aria-label="Paraguay"
    >
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect width="30" height="6.67" fill="#D52B1E" />
      <rect y="13.33" width="30" height="6.67" fill="#0038A8" />
      {/* Escudo Nacional */}
      <circle cx="15" cy="10" r="2.3" fill="none" stroke="#1F8A44" strokeWidth="0.6" />
      <polygon
        points="15,8.3 15.6,9.8 17.2,9.8 15.9,10.7 16.4,12.2 15,11.2 13.6,12.2 14.1,10.7 12.8,9.8 14.4,9.8"
        fill="#FDB813"
      />
    </svg>
  );
}

function ArgentinaFlag({ className = "" }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={`shrink-0 overflow-hidden ${className}`}
      aria-label="Argentina"
    >
      <rect width="30" height="6.67" fill="#74ACDF" />
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      <rect y="13.33" width="30" height="6.67" fill="#74ACDF" />
      {/* Sol de Mayo */}
      <circle cx="15" cy="10" r="1.8" fill="#F6B40E" stroke="#85340A" strokeWidth="0.3" />
      <circle cx="15" cy="10" r="2.5" fill="none" stroke="#F6B40E" strokeWidth="0.5" strokeDasharray="0.6 0.6" />
    </svg>
  );
}

function BrazilFlag({ className = "" }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={`shrink-0 overflow-hidden ${className}`}
      aria-label="Brasil"
    >
      <rect width="30" height="20" fill="#009739" />
      {/* Rombo amarillo */}
      <polygon points="15,2 27.5,10 15,18 2.5,10" fill="#FEDD00" />
      {/* Esfera azul */}
      <circle cx="15" cy="10" r="4.2" fill="#012169" />
      {/* Franja curva blanca */}
      <path
        d="M 11.2,11.3 C 12.8,9.3 16.5,8.8 18.8,10.2"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/**
 * @param {"sm"|"md"|"lg"|"footer"|"auth"|"sidebar-collapsed"|"none"} size
 * @param {string} className Clases adicionales para el contenedor
 * @param {boolean} noLink Si true, no envuelve en <Link>
 * @param {string} to Ruta de navegación (por defecto "/")
 * @param {boolean} dark Si true, adapta textos para fondos oscuros (footer)
 * @param {boolean} onlyIcon Si true, omite el texto "CASA KAREM" al lado
 * @param {boolean} noIcon Si true, omite el emblema y muestra solo el texto
 * @param {boolean} goldText Si true, aplica tipografía dorada metálica elegante
 * @param {boolean} showDetails Si true, muestra "ELECTRONICA - PERFUMERIA" y "Desde 🇵🇾 🇦🇷 🇧🇷 1992"
 * @param {string} textClassName Clases adicionales para el texto
 */
export default function BrandLogo({
  size = "md",
  className = "",
  noLink = false,
  to = "/",
  onClick,
  dark = false,
  onlyIcon = false,
  noIcon = false,
  goldText = false,
  showDetails = true,
  staticLayout = false,
  textClassName = "",
}) {
  const isOnlyIcon = onlyIcon || size === "sidebar-collapsed";
  const isAuth = size === "auth";

  // Dimensiones profesionales para el medallón circular sin fondo exterior
  const emblemContainerClasses = isAuth
    ? "w-28 h-28 sm:w-32 sm:h-32 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-xl"
    : size === "footer"
    ? "w-14 h-14 sm:w-16 sm:h-16 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
    : size === "sm"
    ? "w-9 h-9 sm:w-11 sm:h-11 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
    : size === "sidebar-collapsed"
    ? "w-11 h-11 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
    : "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-md";

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
    <div className="inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 shrink-0 select-none flex-nowrap min-w-0">
      {!noIcon && emblem}

      {!isOnlyIcon && (
        <div
          className={`flex flex-col items-center text-center md:items-start md:text-left leading-none select-none justify-center whitespace-nowrap min-w-0 shrink-0 ${
            staticLayout ? "" : "absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
          }`}
        >
          {/* Línea 1: CASA KAREM */}
          <span
            className={[
              "block w-full text-center md:text-left md:w-auto uppercase transition-all duration-300 select-none tracking-[0.14em] sm:tracking-[0.16em] [text-rendering:optimizeLegibility]",
              size === "footer"
                ? "text-xl sm:text-2xl font-bold"
                : size === "sm"
                ? "text-xs sm:text-sm font-bold"
                : "text-[13px] sm:text-base md:text-lg lg:text-xl font-extrabold",
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

          {/* Línea 2: ELECTRONICA - PERFUMERIA */}
          {showDetails && (
            <>
              <span
                className={[
                  "block w-full text-center md:text-left md:w-auto uppercase font-bold tracking-[0.12em] sm:tracking-[0.16em] transition-colors mt-[2px] sm:mt-[3px]",
                  size === "footer"
                    ? "text-[10px] sm:text-xs"
                    : size === "sm"
                    ? "text-[7px] sm:text-[8px]"
                    : "text-[7.5px] sm:text-[9px] md:text-[10px] lg:text-[11px]",
                  dark
                    ? "text-white/80"
                    : "text-gray-700 group-hover:text-gray-900",
                ].filter(Boolean).join(" ")}
              >
                Electrónica - Perfumería
              </span>

              {/* Línea 3: Desde + Banderas + 1992 (centrado al medio) */}
              <div
                className={[
                  "flex items-center justify-center w-full gap-1 sm:gap-1.5 mt-[2px] sm:mt-[3px] font-semibold select-none transition-colors",
                  size === "footer"
                    ? "text-[9px] sm:text-[10px]"
                    : size === "sm"
                    ? "text-[6.5px] sm:text-[7.5px]"
                    : "text-[7px] sm:text-[8px] md:text-[9.5px] lg:text-[10.5px]",
                  dark
                    ? "text-white/70"
                    : "text-gray-500 group-hover:text-gray-700",
                ].filter(Boolean).join(" ")}
              >
                <span>Desde</span>
                <div className="inline-flex items-center gap-[3px] sm:gap-1">
                  <ParaguayFlag className="h-[8px] w-[12px] sm:h-[9.5px] sm:w-[14px] md:h-[11px] md:w-[16.5px] rounded-[1.5px] ring-1 ring-black/15 shadow-2xs" />
                  <ArgentinaFlag className="h-[8px] w-[12px] sm:h-[9.5px] sm:w-[14px] md:h-[11px] md:w-[16.5px] rounded-[1.5px] ring-1 ring-black/15 shadow-2xs" />
                  <BrazilFlag className="h-[8px] w-[12px] sm:h-[9.5px] sm:w-[14px] md:h-[11px] md:w-[16.5px] rounded-[1.5px] ring-1 ring-black/15 shadow-2xs" />
                </div>
                <span>1992</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  if (noLink) return <div className={`inline-flex items-center ${className}`}>{content}</div>;

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label="Casa Karem"
      className={`group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg transition-opacity hover:opacity-95 ${className}`}
    >
      {content}
    </Link>
  );
}
