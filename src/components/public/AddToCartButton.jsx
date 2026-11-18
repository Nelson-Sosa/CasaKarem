import { memo, useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

function AddToCartButtonBase({ product, size = "desktop", variant = "icon", className = "" }) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    addToCart(product);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // ── Variant "full": botón ancho con texto (para página de detalle) ──
  if (variant === "full") {
    return (
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.2 }}
        aria-label="Agregar al carrito"
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 focus:outline-none ${
          inCart
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-primary text-white hover:bg-primary/90"
        } ${className}`}
      >
        {inCart ? (
          <Check size={18} strokeWidth={2} />
        ) : (
          <ShoppingCart size={18} strokeWidth={1.8} />
        )}
        {inCart ? "Agregado al carrito" : "Agregar al carrito"}
      </motion.button>
    );
  }

  // ── Variant "icon": botón circular con tooltip (default) ──
  const buttonSize = size === "mobile" ? "h-[38px] w-[38px]" : "h-[40px] w-[40px]";
  const iconSize = size === "mobile" ? 18 : 20;

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg pointer-events-none z-50 origin-bottom"
            role="tooltip"
          >
            Agregar al carrito
            <div className="absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.2 }}
        aria-label="Agregar al carrito"
        className={`flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none ${buttonSize} bg-transparent text-gray-600 hover:bg-[#FFC107] hover:text-gray-900 ${inCart ? "text-yellow-600" : ""}`}
      >
        {inCart ? (
          <Check size={iconSize} strokeWidth={1.5} />
        ) : (
          <ShoppingCart size={iconSize} strokeWidth={1.5} />
        )}
      </motion.button>
    </div>
  );
}

const AddToCartButton = memo(AddToCartButtonBase);
export default AddToCartButton;
