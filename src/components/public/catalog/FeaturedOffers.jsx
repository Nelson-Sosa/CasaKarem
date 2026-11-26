import { memo } from "react";
import { Percent } from "lucide-react";
import ProductCarouselSection from "./ProductCarouselSection";

function FeaturedOffersBase({ products }) {
  // Filtrar solo productos en oferta con stock disponible
  const offerProducts = products.filter((p) => p.isOnSale && p.stock > 0);

  return (
    <ProductCarouselSection
      title="Ofertas destacadas"
      subtitle="Deslizá para ver todas las ofertas"
      products={offerProducts}
      icon={<Percent className="h-3 w-3 text-[#E30613]" strokeWidth={2.5} />}
      countSingular="oferta"
      countPlural="ofertas"
      accentBarClass="from-[#E30613] to-[#c70510]"
      mobileHint="Deslizá para ver más ofertas"
      prevAriaLabel="Ver ofertas anteriores"
      nextAriaLabel="Ver más ofertas"
    />
  );
}

const FeaturedOffers = memo(FeaturedOffersBase);
export default FeaturedOffers;
