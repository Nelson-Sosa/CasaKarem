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
  
  // Calcular descuento si hay precio válido y de oferta
  const hasPrice = Number(product.salePrice) > 0;
  const hasDiscount = hasPrice && product.isOnSale && product.offerPrice && product.offerPrice < product.salePrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.salePrice - product.offerPrice) / product.salePrice) * 100)
    : 0;
  const displayPrice = hasDiscount ? product.offerPrice : product.salePrice;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex h-full flex-col rounded-xl bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
    >
      {/* Contenedor de la imagen con padding aumentado para aire */}
      <div className="aspect-square bg-white px-6 pb-3 pt-5">
        
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

          {/* Badge de oferta - esquina superior derecha */}
          {hasDiscount && !isOutOfStock && (
            <div className="absolute right-0 top-0 z-10">
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="rounded-lg bg-gradient-to-br from-[#E30613] to-[#c70510] px-2.5 py-1 shadow-lg"
              >
                <span className="text-[11px] font-black uppercase tracking-wide text-white">
                  -{discountPercentage}%
                </span>
              </motion.div>
            </div>
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
          {hasPrice && (
            hasDiscount ? (
              <div className="mb-2.5">
                <p className="text-xs text-gray-500 line-through">
                  {formatCurrency(product.salePrice)}
                </p>
                <p className="text-base font-bold text-[#E30613]">
                  {formatCurrency(displayPrice)}
                </p>
              </div>
            ) : (
              <p className="mb-2.5 text-base font-bold text-gray-900">
                {formatCurrency(displayPrice)}
              </p>
            )
          )}

          <button
            onClick={() => navigate(`/catalogo/${product.id}`)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 py-2 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-transparent hover:bg-gradient-to-r hover:from-[#8C6010] hover:via-[#C59B27] hover:to-[#8C6010] hover:text-white hover:shadow-md hover:shadow-[#8C6010]/25 active:scale-[0.98] md:bg-white/80 md:text-gray-700"
          >
            <span>Ver detalles</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const ProductCard = memo(ProductCardBase);
export default ProductCard;
