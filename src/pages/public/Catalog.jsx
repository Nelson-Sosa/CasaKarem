import { useState, useEffect, useMemo, useRef } from "react";
import { Search, SlidersHorizontal, X, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getActiveProductsPaginated, countActiveProducts } from "../../services/publicProductService";
import ProductCard from "../../components/public/ProductCard";
import ProductQuickView from "../../components/public/ProductQuickView";
import BottomSheet from "../../components/ui/BottomSheet";
import PublicCatalogLayout from "../../components/public/catalog/PublicCatalogLayout";
import FeaturedProducts from "../../components/public/catalog/FeaturedProducts";

const SORT_OPTIONS = [
  { value: "newest", label: "Más recientes", sortBy: "createdAt", sortDirection: "desc" },
  { value: "price-asc", label: "Menor precio", sortBy: "salePrice", sortDirection: "asc" },
  { value: "price-desc", label: "Mayor precio", sortBy: "salePrice", sortDirection: "desc" },
];

const PAGE_SIZE = 30;

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]); // Para filtrado local
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Estados locales sincronizados con la URL
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [pageDocuments, setPageDocuments] = useState({}); // Cache de cursores por página

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

  // Cargar productos con paginación
  const loadProducts = async (page = 1, resetCache = false) => {
    setLoading(true);
    
    try {
      const sortOption = SORT_OPTIONS.find(opt => opt.value === sort) || SORT_OPTIONS[0];
      
      let lastDoc = null;
      
      // Si no es página 1 y no estamos reseteando, buscar el cursor de la página anterior
      if (page > 1 && !resetCache && pageDocuments[page - 1]) {
        lastDoc = pageDocuments[page - 1];
      }

      const result = await getActiveProductsPaginated({
        sortBy: sortOption.sortBy,
        sortDirection: sortOption.sortDirection,
        lastDoc,
        pageSize: PAGE_SIZE
      });

      // Guardar todos los productos para filtrado local
      setAllProducts(result.products);
      setHasNextPage(result.hasMore);
      
      // Guardar cursor de esta página para navegación futura
      if (result.lastVisible) {
        setPageDocuments(prev => ({
          ...(resetCache ? {} : prev),
          [page]: result.lastVisible
        }));
      }

      // Obtener total de productos activos
      const total = await countActiveProducts();
      setTotalProducts(total);

      // Extraer categorías únicas de todos los productos cargados
      const cats = [...new Set(result.products.map(p => p.categoryName).filter(Boolean))];
      setCategories(cats.sort());
      
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto inicial: cargar productos
  useEffect(() => {
    loadProducts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  // Reset paginación cuando cambian filtros o búsqueda
  useEffect(() => {
    const isInitial = isInitialMount.current;
    if (!isInitial && currentPage !== 1) {
      setCurrentPage(1);
      setPageDocuments({});
      loadProducts(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedCategory]);

  // Filtrar productos localmente (búsqueda y categoría)
  const filtered = useMemo(() => {
    let result = [...allProducts];

    const q = search.trim().toLowerCase();

    if (selectedCategory !== "all") {
      // Si selectedCategory coincide con subcategoryName → solo esa subcategoría
      // Si coincide con categoryName → todos los productos de esa categoría padre (con y sin sub)
      result = result.filter(
        (p) =>
          p.subcategoryName === selectedCategory ||
          p.categoryName === selectedCategory
      );
    }

    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          (p.subcategoryName && p.subcategoryName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allProducts, search, selectedCategory]);

  // Funciones de navegación de página
  const handleNextPage = () => {
    if (hasNextPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadProducts(nextPage, false);
      
      // Scroll suave al inicio
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      loadProducts(prevPage, false);
      
      // Scroll suave al inicio
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calcular información de paginación
  // Si hay filtros activos (búsqueda o categoría), mostramos los filtrados
  // Si no hay filtros, mostramos la paginación normal
  const hasActiveFilters = search.trim() !== "" || selectedCategory !== "all";
  const displayProducts = hasActiveFilters ? filtered : allProducts;
  const displayTotal = hasActiveFilters ? filtered.length : totalProducts;
  
  const startIndex = hasActiveFilters ? 1 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = hasActiveFilters ? filtered.length : Math.min(currentPage * PAGE_SIZE, displayTotal);
  
  // Solo mostrar paginación si no hay filtros activos Y hay más de 30 productos
  const showPagination = !hasActiveFilters && displayTotal > PAGE_SIZE;

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

      {/* Catálogo Completo */}
      <div id="catalogo-completo" className="scroll-mt-32 space-y-4 bg-white sm:space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Catálogo de productos
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Explorá todos nuestros productos disponibles
          </p>
        </div>

        {/* Filter bar (no sticky - desaparece al hacer scroll) */}
        <div className="bg-white pb-3 pt-2">
          <div className="flex items-center justify-between gap-4">
            {/* Resultados info */}
            <div className="text-xs text-gray-500 hidden sm:block">
              {displayTotal > 0 ? (
                hasActiveFilters ? (
                  <>
                    Mostrando <span className="font-semibold text-gray-800">{displayTotal}</span> {displayTotal === 1 ? 'resultado' : 'resultados'}
                  </>
                ) : (
                  <>
                    Mostrando <span className="font-semibold text-gray-800">{startIndex}–{endIndex}</span> de{" "}
                    <span className="font-semibold text-gray-800">{displayTotal}</span> resultados
                  </>
                )
              ) : (
                <span>No hay resultados</span>
              )}
            </div>

              {/* Botón Ordenar */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-border transition-colors hover:bg-gray-50 hover:text-gray-900 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filtros</span>
                </button>

                <div className="hidden items-center gap-2 lg:flex">
                  <span className="text-sm font-medium text-gray-500">Ordenar por:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none transition-all hover:bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    handleSelectCategory("all");
                    setShowFilters(false);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-[#E30613] text-white"
                      : "bg-gray-50 text-gray-600 ring-1 ring-border hover:bg-red-50 hover:text-[#E30613]"
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      handleSelectCategory(cat);
                      setShowFilters(false);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-[#E30613] text-white"
                        : "bg-gray-50 text-gray-600 ring-1 ring-border hover:bg-red-50 hover:text-[#E30613]"
                    }`}
                  >
                    {cat}
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
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls - Solo se muestra si hay más de 30 productos */}
            {showPagination && (
              <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    currentPage === 1
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-white text-gray-700 shadow-sm ring-1 ring-border hover:bg-primary hover:text-white hover:ring-primary"
                  }`}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm">
                    Página {currentPage}
                  </span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!hasNextPage}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    !hasNextPage
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-white text-gray-700 shadow-sm ring-1 ring-border hover:bg-primary hover:text-white hover:ring-primary"
                  }`}
                  aria-label="Página siguiente"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
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
