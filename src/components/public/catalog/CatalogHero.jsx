import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const BANNERS = [
  {
    id: 1,
    src: "/bannerPerfumesMejorado.jpg",
    alt: "Perfumería de Lujo Casa Karem",
    objectPosition: "center",
    hasButton: true,
    category: "Perfumes",
  },
  {
    id: 2,
    src: "/electronica-1280.webp",
    srcSet: "/electronica-640.webp 640w, /electronica-960.webp 960w, /electronica-1280.webp 1280w",
    alt: "Electrónica y Tecnología",
    objectPosition: "center 28%",
    hasButton: false,
  },
];

export default function CatalogHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleScrollToCatalog = () => {
    const el = document.getElementById("catalogo-completo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCategoryClick = (category, e) => {
    e.stopPropagation();
    // Actualizar URL con la categoría
    searchParams.set("category", category);
    setSearchParams(searchParams);
    // Scroll al catálogo
    setTimeout(() => {
      const el = document.getElementById("catalogo-completo");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-play cada 5 segundos
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentBanner = BANNERS[currentIndex];

  return (
    <div
      onClick={handleScrollToCatalog}
      className="group relative flex w-full aspect-[16/9] md:aspect-auto md:h-[400px] lg:h-[480px] xl:h-[520px] cursor-pointer flex-col justify-center overflow-hidden rounded-2xl shadow-sm ring-1 ring-border"
    >
      {/* Banners con AnimatePresence para transiciones suaves */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentBanner.id}
          src={currentBanner.src}
          srcSet={currentBanner.srcSet}
          alt={currentBanner.alt}
          width="1920"
          height="1080"
          fetchPriority="high"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ objectPosition: currentBanner.objectPosition }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </AnimatePresence>

      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-transparent" />

      {/* Botón "COMPRAR AHORA" ROJO - Móvil optimizado / Desktop perfecto y centrado */}
      {currentBanner.hasButton && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div 
            className="absolute pointer-events-auto left-[23.6%] -translate-x-1/2 top-[59%] md:left-[23.3%] md:top-[61%]"
          >
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              onClick={(e) => handleCategoryClick(currentBanner.category, e)}
              className="rounded-lg bg-[#E30613] px-2.5 py-1 md:px-8 md:py-3.5 lg:px-9 text-[9px] md:text-base font-bold uppercase tracking-wider text-white shadow-2xl transition-all hover:bg-[#C20510] hover:shadow-[0_10px_40px_rgba(227,6,19,0.5)] hover:scale-[1.03] active:scale-[0.98]"
            >
              Comprar Ahora
            </motion.button>
          </div>
        </div>
      )}

      {/* Botones de navegación - Estilo Compulandia */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Banner anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Banner siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores de puntos - Estilo Compulandia */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {BANNERS.map((banner, index) => (
          <button
            key={banner.id}
            onClick={(e) => goToSlide(index, e)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Ir a banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
