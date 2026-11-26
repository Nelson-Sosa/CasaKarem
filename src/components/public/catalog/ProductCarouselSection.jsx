import { memo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard";

/**
 * ProductCarouselSection — Carrusel horizontal reutilizable para secciones destacadas
 * (Ofertas destacadas y Productos más vendidos) con la misma paginación/deslizamiento.
 */
function ProductCarouselSectionBase({
  title,
  subtitle,
  products,
  icon,
  countSingular,
  countPlural,
  accentBarClass = "from-[#E30613] to-[#c70510]",
  mobileHint = "Deslizá para ver más productos",
  prevAriaLabel = "Ver productos anteriores",
  nextAriaLabel = "Ver más productos",
}) {
  const scrollContainerRef = useRef(null);

  if (!products || products.length === 0) return null;

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.offsetWidth * 0.8;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Header minimalista con barrita vertical */}
      <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
        <div
          className={`h-8 w-1 shrink-0 bg-gradient-to-b ${accentBarClass} rounded-full mt-0.5`}
        />

        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
              {title}
            </h2>

            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm select-none">
              {icon}
              <span className="font-bold text-gray-900">{products.length}</span>
              <span className="font-normal text-gray-500">
                {products.length === 1 ? countSingular : countPlural}
              </span>
            </div>
          </div>

          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-normal">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Contenedor del carrusel con flechas de navegación */}
      <div className="group relative">
        {products.length > 4 && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 lg:flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 -translate-x-5"
            aria-label={prevAriaLabel}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Carrusel horizontal con snap */}
        <div
          ref={scrollContainerRef}
          className="hide-scrollbar flex gap-4 overflow-x-auto overflow-y-visible pb-4 snap-x snap-mandatory scroll-smooth"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {products.length > 4 && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 lg:flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 translate-x-5"
            aria-label={nextAriaLabel}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Indicador de scroll para móvil */}
      <p className="text-center text-xs text-gray-400 lg:hidden">
        ← {mobileHint} →
      </p>
    </section>
  );
}

const ProductCarouselSection = memo(ProductCarouselSectionBase);
export default ProductCarouselSection;
