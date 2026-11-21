import { useState, useEffect, useMemo, useRef } from "react";
import { Search, SlidersHorizontal, X, Package, ArrowUpDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { subscribeToActiveProducts } from "../../services/publicProductService";
import ProductCard from "../../components/public/ProductCard";
import ProductQuickView from "../../components/public/ProductQuickView";
import BottomSheet from "../../components/ui/BottomSheet";
import PublicCatalogLayout from "../../components/public/catalog/PublicCatalogLayout";
import FeaturedProducts from "../../components/public/catalog/FeaturedProducts";
import FeaturedOffers from "../../components/public/catalog/FeaturedOffers";

const SORT_OPTIONS = [
  { value: "newest", label: "Más recientes", field: "createdAt", direction: "desc" },
  { value: "price-asc", label: "Menor precio", field: "salePrice", direction: "asc" },
  { value: "price-desc", label: "Mayor precio", field: "salePrice", direction: "desc" },
  { value: "name", label: "Nombre A-Z", field: "name", direction: "asc" },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados locales sincronizados con la URL
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Referencias para evitar scroll en el montaje inicial
  const prevSearch = useRef(searchParams.get("q") || "");
  const prevCategory = useRef(searchParams.get("category") || "all");
  const isInitialMount = useRef(true);

  // Efecto para el auto-scroll hacia los resultados
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentSearch = searchParams.get("q") || "";
    const currentCategory = searchParams.get("category") || "all";
    
    // Solo scrollear si cambió la búsqueda o categoría
    if (prevSearch.current !== currentSearch || prevCategory.current !== currentCategory) {
      prevSearch.current = currentSearch;
      prevCategory.current = currentCategory;
      
      setTimeout(() => {
        const resultsSection = document.getElementById("catalogo-completo");
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [searchParams]);

  // Sincronizar URL hacia el estado local
  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  // Actualizar URL cuando cambia la categoría desde la sidebar
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  // ✅ Suscripción en tiempo real a productos activos
  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToActiveProducts(
      (products) => {
        setAllProducts(products);
        
        // Extraer categorías únicas
        const cats = [...new Set(products.map(p => p.categoryName).filter(Boolean))];
        setCategories(cats.sort());
        
        setLoading(false);
      },
      (error) => {
        console.error("Error al cargar productos en tiempo real:", error);
        setLoading(false);
      }
    );

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // Filtrar y ordenar productos localmente
  const filtered = useMemo(() => {
    let result = [...allProducts];

    const q = search.trim().toLowerCase();

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.subcategoryName === selectedCategory ||
          p.categoryName === selectedCategory
      );
    }

    // Filtrar por búsqueda
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          (p.subcategoryName && p.subcategoryName.toLowerCase().includes(q))
      );
    }

    // Ordenar según la opción seleccionada
    const sortOption = SORT_OPTIONS.find(opt => opt.value === sort) || SORT_OPTIONS[0];
    
    result.sort((a, b) => {
      const field = sortOption.field;
      const direction = sortOption.direction;
      
      let aValue = a[field];
      let bValue = b[field];
      
      // Manejar campos especiales
      if (field === "createdAt") {
        // Convertir timestamps de Firestore a milisegundos (con fallback a Date.now() para productos recién creados)
        aValue = aValue?.toMillis ? aValue.toMillis() : (aValue?.seconds ? aValue.seconds * 1000 : Date.now());
        bValue = bValue?.toMillis ? bValue.toMillis() : (bValue?.seconds ? bValue.seconds * 1000 : Date.now());
      } else if (field === "name") {
        // Comparación alfabética case-insensitive
        aValue = (aValue || "").toLowerCase();
        bValue = (bValue || "").toLowerCase();
      }
      
      // Comparación
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [allProducts, search, selectedCategory, sort]);

  // Información para mostrar
  const displayProducts = filtered;
  const displayTotal = filtered.length;
  const hasActiveFilters = search.trim() !== "" || selectedCategory !== "all";

  const quickviewId = searchParams.get("quickview");
  const quickviewProduct = useMemo(() => {
    if (!quickviewId) return null;
    return displayProducts.find(p => p.id === quickviewId) || null;
  }, [quickviewId, displayProducts]);

  return (
    <div className="space-y-8 bg-white sm:space-y-10">
      
      {/* Sección Hero: Banner Principal */}
      <PublicCatalogLayout />

      {/* Carrusel de Productos Destacados (Oculto temporalmente) */}
      {/* <FeaturedProducts products={products} loading={loading} /> */}

      {/* Sección de Ofertas Destacadas - Solo visible si no hay filtros activos y hay productos en oferta */}
      {!loading && !hasActiveFilters && allProducts.length > 0 && (
        <FeaturedOffers products={allProducts} />
      )}

      {/* Catálogo Completo */}
      <div id="catalogo-completo" className="scroll-mt-32 space-y-4 bg-white sm:space-y-6">
        
        {/* Cabecera Boutique Minimalista */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-gray-100">
          
          {/* Lado izquierdo: Barrita dorada + Título + Píldora + Subtítulo */}
          <div className="flex items-start gap-3">
            {/* Barrita vertical dorada */}
            <div className="h-8 w-1 shrink-0 bg-gradient-to-b from-[#B88B35] to-[#8A641E] rounded-full mt-0.5" />
            
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                  Catálogo de productos
                </h2>
                
                {/* Indicador exacto: Punto verde + número en negrita + productos */}
                {displayTotal > 0 && (
                  <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm select-none">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-bold text-gray-900">{displayTotal}</span>
                    <span className="font-normal text-gray-500">{displayTotal === 1 ? "producto" : "productos"}</span>
                  </div>
                )}
              </div>
              
              <p className="mt-1 text-xs sm:text-sm text-gray-500 font-normal">
                Explorá todos nuestros productos disponibles
              </p>
            </div>
          </div>

          {/* Lado derecho: Botón mobile Filtros / Selector desktop Ordenar por */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            {/* Mobile: botón filtros */}
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-xs ring-1 ring-border transition-all hover:border-[#B88B35]/50 hover:bg-[#FCF9F2]/50 hover:text-gray-900 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#8F6820]" />
              <span>Filtros y orden</span>
            </button>

            {/* Desktop: selector Ordenar por con ícono elegante */}
            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Ordenar por:
              </span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8F6820]">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-8 text-sm font-medium text-gray-700 shadow-xs outline-none transition-all hover:border-[#B88B35]/60 hover:bg-[#FCF9F2]/30 focus:border-[#B88B35] focus:ring-2 focus:ring-[#B88B35]/15 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet para Filtros y Orden (Mobile) */}
        <BottomSheet 
          isOpen={showFilters} 
          onClose={() => setShowFilters(false)}
          title="Filtros y Orden"
        >
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-800">Ordenar por</h3>
              <div className="flex flex-col gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setShowFilters(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      sort === opt.value
                        ? "bg-primary-light text-primary ring-1 ring-primary/30"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                    {sort === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-800">Categorías</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    handleSelectCategory("all");
                    setShowFilters(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-[#E30613] text-white"
                      : "bg-gray-50 text-gray-600 ring-1 ring-border hover:bg-red-50 hover:text-[#E30613]"
                  }`}
                >
                  Todas
                  {selectedCategory === "all" && <div className="h-2 w-2 rounded-full bg-white" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      handleSelectCategory(cat);
                      setShowFilters(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-[#E30613] text-white"
                        : "bg-gray-50 text-gray-600 ring-1 ring-border hover:bg-red-50 hover:text-[#E30613]"
                    }`}
                  >
                    {cat}
                    {selectedCategory === cat && <div className="h-2 w-2 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </BottomSheet>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border">
                <div className="aspect-square animate-pulse bg-gray-100" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="mt-4 h-9 w-full animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && displayProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              {search || selectedCategory !== "all" ? (
                <Search className="h-8 w-8 text-gray-400" />
              ) : (
                <Package className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <h3 className="mt-5 text-base font-semibold text-gray-800">
              {search || selectedCategory !== "all"
                ? "No encontramos productos"
                : "No hay productos disponibles"}
            </h3>
            <p className="mt-1.5 max-w-sm text-center text-sm text-gray-500">
              {search || selectedCategory !== "all"
                ? "Intenta con otros términos de búsqueda o seleccioná 'Todas' las categorías."
                : "Los productos aparecerán aquí cuando estén publicados."}
            </p>
            {(search || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  searchParams.delete("q");
                  handleSelectCategory("all");
                }}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-[#E30613] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#c70510] active:scale-95"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Product grid */}
        {!loading && displayProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Quick View Modal */}
        {quickviewProduct && (
          <ProductQuickView 
            product={quickviewProduct} 
            onClose={() => {
              searchParams.delete("quickview");
              setSearchParams(searchParams);
            }} 
          />
        )}
      </div>
    </div>
  );
}
