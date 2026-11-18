import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductImage from "../ui/ProductImage";
import { formatCurrency } from "../../utils/formatCurrency";
import AddToCartButton from "./AddToCartButton";
import QuickViewButton from "./QuickViewButton";
import FavoriteButton from "./FavoriteButton";

function ProductCardBase({ product }) {
  const navigate = useNavigate();
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null;
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex h-full flex-col rounded-xl bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
    >
      {/* Contenedor de la imagen con padding aumentado para aire */}
      <div className="aspect-square bg-white px-6 pb-10 pt-5">
        
        {/* Contenedor relativo para la imagen y la etiqueta */}
        <div className="relative h-full w-full">
          {/* Imagen del producto */}
          <ProductImage
            image={image}
            type="catalog"
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            wrapperClassName="h-full w-full"
          />

          {/* Badge de categoría - cristal ultra transparente con glassmorphism */}
          {product.categoryName && (
            <span 
              className="absolute bottom-2 left-2 z-10 rounded-full px-2.5 py-1"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(224, 242, 254, 0.15) 100%)',
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -1px 2px rgba(148, 163, 184, 0.15)',
                color: '#1e293b',
                fontWeight: 600,
                fontSize: '11px'
              }}
            >
              {product.categoryName}
            </span>
          )}

          {/* Overlay agotado */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <span className="rounded-full bg-danger px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-lg">
                AGOTADO
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Info del producto - sin bordes divisorios */}
      <div className="flex flex-1 flex-col p-4">
        {/* Acciones rápidas - sin border-top */}
        {!isOutOfStock && (
          <div className="mb-3 flex flex-row justify-center gap-1.5">
            <AddToCartButton product={product} />
            <QuickViewButton product={product} />
            <FavoriteButton product={product} />
          </div>
        )}

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800">
          {product.name}
        </h3>

        {/* Precio y botón en la parte inferior */}
        <div className="mt-auto pt-3">
          <p className="mb-2.5 text-base font-bold text-gray-900">
            {formatCurrency(product.salePrice)}
          </p>

          <button
            onClick={() => navigate(`/catalogo/${product.id}`)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-light py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Ver detalles
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const ProductCard = memo(ProductCardBase);
export default ProductCard;
