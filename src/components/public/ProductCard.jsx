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
      <div className="relative aspect-square bg-white px-6 pb-10 pt-5">
        
        {/* Imagen del producto */}
        <ProductImage
          image={image}
          type="catalog"
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          wrapperClassName="h-full w-full"
        />

        {/* Badge de categoría - fondo cristalino ultra claro */}
        {product.categoryName && (
          <span 
            className="absolute bottom-2 left-2 z-10 rounded-full border px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm"
            style={{
              backgroundColor: 'rgba(241, 245, 249, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderColor: 'rgba(226, 232, 240, 0.8)',
              fontWeight: 500,
              color: '#475569'
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
