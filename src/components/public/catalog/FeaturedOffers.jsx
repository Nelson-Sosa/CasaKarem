import { memo } from "react";
import { motion } from "framer-motion";
import { Percent } from "lucide-react";
import ProductCard from "../ProductCard";

function FeaturedOffersBase({ products }) {
  // Filtrar solo productos en oferta
  const offerProducts = products.filter(p => p.isOnSale && p.stock > 0);

  // Si no hay productos en oferta, no mostrar la sección
  if (offerProducts.length === 0) return null;

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
            Aprovechá estos precios especiales
          </p>
        </div>
      </div>

      {/* Grid de productos en oferta - mismo estilo que el catálogo */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {offerProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const FeaturedOffers = memo(FeaturedOffersBase);
export default FeaturedOffers;
