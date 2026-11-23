import { memo, useRef } from "react";
import { Percent, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard";

function FeaturedOffersBase({ products }) {
  const scrollContainerRef = useRef(null);

  // Filtrar solo productos en oferta
  const offerProducts = products.filter(p => p.isOnSale && p.stock > 0);

  // Si no hay productos en oferta, no mostrar la sección
  if (offerProducts.length === 0) return null;

  // Función para scroll suave con las flechas
  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.offsetWidth * 0.8; // Scroll 80% del ancho visible
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Header minimalista con barrita dorada */}
      <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
        {/* Barrita vertical dorada */}
        <div className="h-8 w-1 shrink-0 bg-gradient-to-b from-[#E30613] to-[#c70510] rounded-full mt-0.5" />
        
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
              Ofertas destacadas
            </h2>
            
            {/* Contador de ofertas */}
            {offerProducts.length > 0 && (
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm select-none">
                <Percent className="h-3 w-3 text-[#E30613]" strokeWidth={2.5} />
                <span className="font-bold text-gray-900">{offerProducts.length}</span>
                <span className="font-normal text-gray-500">{offerProducts.length === 1 ? "oferta" : "ofertas"}</span>
              </div>
            )}
          </div>
          
          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-normal">
            Deslizá para ver todas las ofertas
          </p>
        </div>
      </div>

      {/* Contenedor del carrusel con flechas de navegación */}
      <div className="group relative">
        {/* Flecha Izquierda - Solo desktop */}
        {offerProducts.length > 4 && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 lg:flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 -translate-x-5"
            aria-label="Ver ofertas anteriores"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Carrusel de ofertas - Scroll horizontal con snap */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto overflow-y-visible pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE/Edge */
            WebkitOverflowScrolling: 'touch' /* iOS smooth scroll */
          }}
        >
          {offerProducts.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.67rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Flecha Derecha - Solo desktop */}
        {offerProducts.length > 4 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 lg:flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 translate-x-5"
            aria-label="Ver más ofertas"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Gradientes laterales para indicar más contenido - Solo desktop */}
        <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-12 bg-gradient-to-r from-white to-transparent lg:block" />
        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-12 bg-gradient-to-l from-white to-transparent lg:block" />
      </div>

      {/* Indicador de scroll para móvil */}
      <p className="text-center text-xs text-gray-400 lg:hidden">
        ← Deslizá para ver más ofertas →
      </p>

      {/* CSS personalizado para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

const FeaturedOffers = memo(FeaturedOffersBase);
export default FeaturedOffers;
