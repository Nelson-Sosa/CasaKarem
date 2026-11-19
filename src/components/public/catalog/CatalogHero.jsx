import { motion } from "framer-motion";

export default function CatalogHero() {
  const handleScrollToCatalog = () => {
    const el = document.getElementById("catalogo-completo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={handleScrollToCatalog}
      className="group relative flex w-full min-h-[200px] xs:min-h-[240px] sm:min-h-[280px] md:min-h-[340px] lg:min-h-[400px] aspect-[16/7] sm:aspect-[2.16/1] cursor-pointer flex-col justify-center overflow-hidden rounded-2xl shadow-sm ring-1 ring-border"
    >
      {/* Imagen de Publicidad */}
      <img 
        srcSet="/electronica-640.webp 640w, /electronica-960.webp 960w, /electronica-1280.webp 1280w"
        sizes="(max-width: 768px) 100vw, 1600px"
        src="/electronica-960.webp"
        alt="Ofertas Especiales"
        width="1843"
        height="853"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      
      {/* Overlay sutil para mejorar contraste y hover state */}
      <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-transparent" />
      
    </motion.div>
  );
}
