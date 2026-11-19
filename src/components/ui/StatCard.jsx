import { formatCurrency } from "../../utils/formatCurrency";

const ACCENT_VARIANTS = {
  amber: {
    circle: "bg-amber-50/80 border border-amber-200/60",
    icon: "text-[#B88B35]",
    bar: "bg-gradient-to-r from-[#8A641E] via-[#B88B35] to-[#C9A048]",
  },
  gold: {
    circle: "bg-[#FCF9F2] border border-[#B88B35]/40",
    icon: "text-[#8F6820]",
    bar: "bg-gradient-to-r from-[#8A641E] via-[#B88B35] to-[#C9A048]",
  },
  blue: {
    circle: "bg-indigo-50/80 border border-indigo-200/60",
    icon: "text-indigo-600",
    bar: "bg-indigo-500",
  },
  indigo: {
    circle: "bg-indigo-50/80 border border-indigo-200/60",
    icon: "text-indigo-600",
    bar: "bg-indigo-500",
  },
  emerald: {
    circle: "bg-emerald-50/80 border border-emerald-200/60",
    icon: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  rose: {
    circle: "bg-red-50/80 border border-red-200/60",
    icon: "text-red-600",
    bar: "bg-red-600",
  },
  danger: {
    circle: "bg-red-50/80 border border-red-200/60",
    icon: "text-red-600",
    bar: "bg-red-600",
  },
};

export default function StatCard({ title, value, icon: Icon, accent = "amber", kind = "number" }) {
  const isPlaceholder = value === null || value === undefined;

  const variant = ACCENT_VARIANTS[accent] || ACCENT_VARIANTS.amber;

  function format(val) {
    if (isPlaceholder) return "—";
    if (typeof val === "number") {
      if (kind === "currency") return formatCurrency(val);
      return val.toLocaleString("es-PY");
    }
    return val;
  }

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border transition-all hover:shadow-md">
      <div className={`h-1 w-full ${variant.bar}`} />
      <div className="p-3 xs:p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs xs:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p
              className={`mt-1 xs:mt-2 text-xl xs:text-2xl font-bold tracking-tight sm:text-3xl ${
                isPlaceholder ? "text-gray-300" : "text-gray-800"
              }`}
            >
              {isPlaceholder ? (
                <span className="text-base font-normal text-gray-400">—</span>
              ) : (
                format(value)
              )}
            </p>
          </div>
          <div className={`flex h-10 w-10 xs:h-12 xs:w-12 shrink-0 items-center justify-center rounded-xl ${variant.circle} sm:h-14 sm:w-14`}>
            <Icon className={`h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 ${variant.icon}`} />
          </div>
        </div>
        {isPlaceholder && (
          <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
            Conecta Firestore para mostrar datos
          </p>
        )}
      </div>
    </div>
  );
}
