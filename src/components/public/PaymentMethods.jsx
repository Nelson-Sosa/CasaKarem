import { ShieldCheck } from "lucide-react";

export default function PaymentMethods() {
  const paymentMethods = [
    {
      name: "Bancard",
      logo: "/payment-logos/bancard.svg",
      types: ["Débito", "Crédito"],
    },
    {
      name: "Dinelco",
      logo: "/payment-logos/dinelco.svg",
      types: ["Débito", "Crédito"],
    },
  ];

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Métodos de pago
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed">
              Aboná tu compra de forma rápida y segura con las siguientes opciones:
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        {/* Payment cards grid - diseño refinado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          {paymentMethods.map((method) => (
            <div
              key={method.name}
              className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 transition-colors hover:border-[#B88B35]/50"
            >
              {/* Logo container limpio */}
              <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 p-2">
                {method.logo ? (
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* Fallback icon */}
                <div className="hidden h-full w-full items-center justify-center">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>

              {/* Info con badges modernos */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">{method.name}</h3>
                <div className="flex flex-wrap items-center gap-1.5">
                  {method.types.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nota inferior boutique - sin caja azul */}
        <div className="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-[#B88B35]/30 bg-[#FCF9F2] px-4 py-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#9C7428] mt-0.5" strokeWidth={2} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Pago seguro con POS</p>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
              Realizá tu pago con tarjetas de débito o crédito en nuestro local al retirar tu pedido, o consultanos por WhatsApp para coordinar otras modalidades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
