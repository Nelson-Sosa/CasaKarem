/**
 * Banderas oficiales vectoriales (SVG).
 * Compatibles con todos los navegadores y sistemas operativos (incluyendo Windows,
 * que no renderiza emojis de banderas de países).
 */

export function ParaguayFlag({ className = "" }) {
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

export function ArgentinaFlag({ className = "" }) {
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

export function BrazilFlag({ className = "" }) {
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

export function USFlag({ className = "" }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={`shrink-0 overflow-hidden ${className}`}
      aria-label="Estados Unidos"
    >
      <rect width="30" height="20" fill="#FFFFFF" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
      ))}
      <rect width="12.5" height={(7 * 20) / 13} fill="#3C3B6E" />
      {/* Estrellas simplificadas para lectura nítida en tamaño pequeño */}
      {[2, 5, 8, 10.5].map((cx) =>
        [2, 5, 8].map((cy) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.55" fill="#FFFFFF" />
        ))
      )}
    </svg>
  );
}

export function EUFlag({ className = "" }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    return {
      cx: 15 + 6 * Math.cos(angle),
      cy: 10 + 6 * Math.sin(angle),
    };
  });

  return (
    <svg
      viewBox="0 0 30 20"
      className={`shrink-0 overflow-hidden ${className}`}
      aria-label="Unión Europea"
    >
      <rect width="30" height="20" fill="#003399" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r="0.85" fill="#FFCC00" />
      ))}
    </svg>
  );
}
