import { memo } from "react";
import { Flame } from "lucide-react";
import ProductCarouselSection from "./ProductCarouselSection";

function BestSellersBase({ products }) {
  // Filtrar solo productos marcados como más vendidos con stock disponible
  const bestSellerProducts = products.filter((p) => p.isBestSeller && p.stock > 0);

  return (
    <ProductCarouselSection
      title="Productos más vendidos"
      subtitle="Deslizá para ver los productos más elegidos"
      products={bestSellerProducts}
      icon={<Flame className="h-3.5 w-3.5 text-[#B88B35]" strokeWidth={2.3} />}
      countSingular="destacado"
      countPlural="destacados"
      accentBarClass="from-[#B88B35] to-[#8A641E]"
      mobileHint="Deslizá para ver más productos vendidos"
      prevAriaLabel="Ver productos más vendidos anteriores"
      nextAriaLabel="Ver más productos más vendidos"
    />
  );
}

const BestSellers = memo(BestSellersBase);
export default BestSellers;
