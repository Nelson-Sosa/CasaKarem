/**
 * PaymentMethods — Sección de medios de pago aceptados para el detalle de producto.
 *
 * Muestra los 10 medios de pago oficiales en Paraguay (Bancard, Visa, Mastercard,
 * Dinelco, Cabal, Panal, Credicard, SIP, Tigo Money y Personal Pay) con logos SVG
 * fieles en tarjetas uniformes y diseño responsivo.
 */

const VisaLogo = () => (
  <svg
    viewBox="0 0 68 24"
    className="h-full w-auto"
    role="img"
    aria-label="Visa"
  >
    {/* Ala dorada característica sobre la V */}
    <polygon points="3,5 12,5 13.8,9 7.2,9" fill="#F7B600" />
    <text
      x="37"
      y="18.5"
      textAnchor="middle"
      fill="#1434CB"
      fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
      fontWeight="900"
      fontStyle="italic"
      fontSize="18"
      letterSpacing="-0.5"
    >
      VISA
    </text>
  </svg>
);

const MastercardLogo = () => (
  <svg
    viewBox="0 0 42 26"
    className="h-full w-auto"
    role="img"
    aria-label="Mastercard"
  >
    <circle cx="15" cy="13" r="10" fill="#EB001B" />
    <circle cx="27" cy="13" r="10" fill="#F79E1B" />
    {/* Intersección naranja oficial */}
    <path d="M 21 5 A 10 10 0 0 1 21 21 A 10 10 0 0 1 21 5 Z" fill="#FF5F00" />
  </svg>
);

const DinelcoLogo = () => (
  <svg
    viewBox="0 0 104 26"
    className="h-full w-auto"
    role="img"
    aria-label="Dinelco"
  >
    {/* Isotipo oficial Dinelco (doble trazo curvo violeta/morado) */}
    <path
      d="M 15.5 3.5 V 15.5 C 15.5 19.2 12.6 22 9 22 C 5.4 22 2.5 19.2 2.5 15.5 C 2.5 11.8 5.4 9 9 9 C 10.6 9 12 9.6 13.1 10.5"
      fill="none"
      stroke="#60269E"
      strokeWidth="2.3"
      strokeLinecap="round"
    />
    <path
      d="M 12 6.5 V 15.3 C 12 17.2 10.7 18.6 9 18.6 C 7.3 18.6 6 17.2 6 15.5 C 6 13.8 7.3 12.4 9 12.4 C 10.1 12.4 11 13 11.5 13.8"
      fill="none"
      stroke="#7C3AED"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <text
      x="61"
      y="19"
      textAnchor="middle"
      fill="#111827"
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
      fontWeight="800"
      fontSize="16.5"
      letterSpacing="-0.4"
    >
      dinelco.
    </text>
  </svg>
);

const CabalLogo = () => (
  <svg
    viewBox="0 0 92 26"
    className="h-full w-auto"
    role="img"
    aria-label="Cabal"
  >
    <rect width="92" height="26" rx="3.5" fill="#00679A" />
    {/* Rombo oficial Cabal */}
    <polygon
      points="14,5.5 21.5,13 14,20.5 6.5,13"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <polyline
      points="16,9.5 11.5,13 16,16.5"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="55"
      y="17.5"
      textAnchor="middle"
      fill="#FFFFFF"
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
      fontWeight="800"
      fontSize="13.5"
      letterSpacing="0.8"
    >
      CABAL
    </text>
  </svg>
);

const PanalLogo = () => (
  <svg
    viewBox="0 0 42 30"
    className="h-full w-auto"
    role="img"
    aria-label="Panal"
  >
    {/* Cuadrado verde oficial Panal */}
    <rect x="2" y="1.5" width="38" height="27" rx="2" fill="#E8F5EC" stroke="#00853E" strokeWidth="2.2" />
    <rect x="4" y="3" width="11" height="24" fill="#BCE3C8" opacity="0.65" />
    <rect x="27" y="3" width="11" height="24" fill="#BCE3C8" opacity="0.65" />
    {/* Flechas verticales opuestas */}
    <path d="M 17 12 V 6.5 M 14.5 9 L 17 6.2 L 19.5 9" fill="none" stroke="#00853E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 25 6.2 V 11.7 M 22.5 9.2 L 25 12 L 27.5 9.2" fill="none" stroke="#00853E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <text
      x="21"
      y="23"
      textAnchor="middle"
      fill="#007A33"
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
      fontWeight="900"
      fontSize="11"
      letterSpacing="-0.2"
    >
      panal
    </text>
  </svg>
);

const CredicardLogo = () => (
  <svg
    viewBox="0 0 32 32"
    className="h-full w-auto"
    role="img"
    aria-label="Credicard"
  >
    {/* Círculo oficial amarillo y verde */}
    <circle cx="16" cy="16" r="14" fill="#FDE100" stroke="#007A33" strokeWidth="2.5" />
    {/* Dos pinos / triángulos verdes oficiales */}
    <polygon points="10.5,8.5 6.5,21.5 14.5,21.5" fill="#007A33" />
    <polygon points="18.5,8.5 14.5,21.5 22.5,21.5" fill="#007A33" />
    {/* Arco verde lateral derecho característico */}
    <path
      d="M 23.5 9.5 C 26.5 12.5 26.5 19.5 23.5 22.5"
      fill="none"
      stroke="#007A33"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const SipLogo = () => (
  <svg
    viewBox="0 0 46 30"
    className="h-full w-auto"
    role="img"
    aria-label="SIP"
  >
    {/* Flecha superior roja */}
    <path
      d="M 11 7 C 16 3 28 3 34 7"
      fill="none"
      stroke="#E30613"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <polygon points="35.5,7.8 30.5,7.8 33.5,4" fill="#E30613" />
    {/* Texto central azul */}
    <text
      x="23"
      y="20.5"
      textAnchor="middle"
      fill="#004B93"
      fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
      fontWeight="900"
      fontSize="16"
      letterSpacing="-0.5"
    >
      sip
    </text>
    {/* Flecha inferior azul */}
    <path
      d="M 35 23 C 30 27 18 27 12 23"
      fill="none"
      stroke="#004B93"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <polygon points="10.5,22.2 15.5,22.2 12.5,26" fill="#004B93" />
  </svg>
);

const TigoMoneyLogo = () => (
  <svg
    viewBox="0 0 110 28"
    className="h-full w-auto"
    role="img"
    aria-label="Tigo Money"
  >
    <rect width="110" height="28" rx="4" fill="#00377B" />
    {/* Sonrisa/arco superior sobre "tigo" */}
    <path
      d="M 16 6.2 C 20 4.2 26 4.2 29.5 6.2"
      fill="none"
      stroke="#00C4FF"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <text
      x="22"
      y="19.5"
      textAnchor="middle"
      fill="#FFFFFF"
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
      fontWeight="800"
      fontSize="14.5"
      letterSpacing="-0.4"
    >
      tigo
    </text>
    <text
      x="65"
      y="19.5"
      textAnchor="middle"
      fill="#FFD100"
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
      fontWeight="800"
      fontStyle="italic"
      fontSize="14"
      letterSpacing="-0.3"
    >
      money
    </text>
    {/* Emblema mano/rayos amarillo a la derecha */}
    <path
      d="M 94 17 L 99 10 M 96.5 18.5 L 102.5 12 M 99 19.5 L 104 15.5"
      stroke="#FFD100"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const PersonalPayLogo = () => (
  <svg
    viewBox="0 0 98 28"
    className="h-full w-auto"
    role="img"
    aria-label="Personal Pay"
  >
    {/* Ícono billetera/tarjeta con ondas celeste/azul */}
    <rect
      x="5"
      y="9"
      width="17"
      height="13"
      rx="2.5"
      fill="none"
      stroke="#0077C8"
      strokeWidth="1.8"
    />
    <path
      d="M 8 9 V 7 C 8 5.8 9 5 10.2 5 H 20 C 21.1 5 22 5.9 22 7 V 9"
      fill="none"
      stroke="#00A9E0"
      strokeWidth="1.6"
    />
    <path
      d="M 10 14 C 12 12.2 15 12.2 17 14 M 11.5 17 C 12.8 15.8 14.4 15.8 15.6 17"
      fill="none"
      stroke="#00A9E0"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Texto apilado */}
    <text
      x="28"
      y="13.5"
      fill="#005596"
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
      fontWeight="700"
      fontSize="11.5"
      letterSpacing="-0.2"
    >
      personal
    </text>
    <text
      x="28"
      y="23.5"
      fill="#00A9E0"
      fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
      fontWeight="800"
      fontSize="11.5"
      letterSpacing="-0.2"
    >
      pay
    </text>
  </svg>
);

const PAYMENT_METHODS = [
  {
    id: "bancard",
    name: "Bancard",
    render: () => (
      <img
        src="/payment-logos/bancard.svg"
        alt="Bancard"
        className="h-full w-auto object-contain rounded-[3px]"
      />
    ),
  },
  { id: "visa", name: "Visa", render: () => <VisaLogo /> },
  { id: "mastercard", name: "Mastercard", render: () => <MastercardLogo /> },
  { id: "dinelco", name: "Dinelco", render: () => <DinelcoLogo /> },
  { id: "cabal", name: "Cabal", render: () => <CabalLogo /> },
  { id: "panal", name: "Panal", render: () => <PanalLogo /> },
  { id: "credicard", name: "Credicard", render: () => <CredicardLogo /> },
  { id: "sip", name: "SIP", render: () => <SipLogo /> },
  { id: "tigo-money", name: "Tigo Money", render: () => <TigoMoneyLogo /> },
  { id: "personal-pay", name: "Personal Pay", render: () => <PersonalPayLogo /> },
];

export default function PaymentMethods() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border">
      {/* Header con identidad boutique */}
      <div className="border-b border-gray-100 bg-white px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-start gap-3">
          {/* Ícono elegante en tono marfil/dorado */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCF9F2] border border-[#B88B35]/30 p-2.5">
            <svg
              className="h-5 w-5 text-[#9C7428]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Medios de pago aceptados
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed">
              Aboná tu compra de forma rápida y segura con tarjetas, redes locales y billeteras electrónicas:
            </p>
          </div>
        </div>
      </div>

      {/* Insignias oficiales responsivas */}
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.id}
              title={method.name}
              className="inline-flex h-8 sm:h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 shadow-2xs transition-all hover:border-[#B88B35]/50 hover:shadow-sm"
            >
              {method.render()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
