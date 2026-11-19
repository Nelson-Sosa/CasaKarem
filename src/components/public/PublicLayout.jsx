import { Outlet, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { User, LogOut, ShoppingCart, Heart, Search, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../hooks/useCategories";
import WhatsappFloat from "./WhatsappFloat";
import CategoryNavigation from "./catalog/CategoryNavigation";
import MobileMenuDrawer from "./catalog/MobileMenuDrawer";
import BrandLogo from "../ui/BrandLogo";
import Footer from "./Footer";

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const { categories, categoriesGrouped } = useCategories();
  
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const isWishlistRoute = location.pathname.includes("/favoritos");
  const isCartRoute = location.pathname.includes("/carrito");
  // Determinar si estamos en la ruta exacta del catálogo para marcar la categoría seleccionada
  const isCatalogRoot = location.pathname === "/catalogo" || location.pathname === "/catalogo/";
  const currentCategory = isCatalogRoot ? (searchParams.get("category") || "all") : null;

  // Cerrar menú de usuario al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate("/catalogo");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate(`/catalogo`);
    }
  };

  const handleSelectCategory = (cat) => {
    if (cat === "all") {
      navigate("/catalogo");
    } else {
      navigate(`/catalogo?category=${encodeURIComponent(cat)}`);
    }
  };

  // Solo categorías principales para la navegación (sin parentId)
  const parentCategoryNames = categoriesGrouped.map(c => c.name).sort();

  // Para el drawer móvil pasamos el árbol completo
  const categoriesTree = categoriesGrouped;

  // Obtener la inicial del usuario para el avatar
  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";
  
  return (
    <div className="min-h-screen bg-background-secondary">
      <header className="sticky top-0 z-50 border-b border-border bg-white shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 md:h-20 max-w-[1600px] items-center justify-between px-3 md:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-xl text-gray-700 transition-colors hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <BrandLogo size="md" goldText />
          </div>

          {/* Buscador central prominente (solo Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative flex w-full items-stretch overflow-hidden rounded-[3px] border-2 border-[#E30613] bg-white shadow-sm transition-all focus-within:shadow-md">
              <div className="relative flex flex-1 items-center">
                <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#E30613]" strokeWidth={2.2} />
                <input
                  type="text"
                  placeholder="Buscar productos"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-white py-2.5 pl-10 pr-3 text-[15px] text-gray-800 placeholder-gray-400 outline-none"
                />
              </div>
              <button
                type="submit"
                aria-label="Buscar"
                className="flex items-center justify-center bg-[#E30613] px-4 sm:px-5 text-white transition-colors hover:bg-[#c70510] shrink-0 cursor-pointer"
              >
                <Search className="h-4 w-4 text-white" strokeWidth={2.4} />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to="/catalogo/favoritos"
              className={`relative flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer ${isWishlistRoute ? 'bg-red-50 text-danger ring-1 ring-danger/20' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-danger'}`}
            >
              <Heart className={`h-4 w-4 ${isWishlistRoute ? 'fill-danger/20' : ''}`} />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span 
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white shadow-sm ring-2 ring-white"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Link 
              to="/catalogo/carrito"
              className={`relative flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer ${isCartRoute ? 'bg-red-50 text-[#E30613] ring-1 ring-[#E30613]/20' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-[#E30613]'}`}
            >
              <ShoppingCart className="h-4 w-4" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E30613] text-[10px] font-bold text-white shadow-sm ring-2 ring-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {user ? (
              <div className="relative flex items-center gap-2" ref={userMenuRef}>
                {/* Avatar con menú desplegable en móvil, botones visibles en desktop */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex h-8 w-8 md:hidden shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm"
                >
                  {userInitial}
                </button>

                {/* Desktop: avatar + botones visibles */}
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm">
                    {userInitial}
                  </div>
                  {user.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden lg:inline">Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-white px-3 lg:px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-danger hover:text-danger hover:shadow-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden lg:inline">Cerrar</span>
                  </button>
                </div>

                {/* Menú desplegable móvil */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-10 z-50 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-border md:hidden">
                    <div className="p-2">
                      {user.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-primary-light hover:text-primary"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Panel de administración
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-danger transition-colors hover:bg-danger/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" strokeWidth={1.8} />
                <span>Cuenta</span>
              </Link>
            )}
          </div>
        </div>

        {/* Buscador móvil (solo visible en pantallas pequeñas) */}
        <div className="mx-auto px-3 pb-3 md:px-6 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex w-full items-stretch overflow-hidden rounded-[3px] border-2 border-[#E30613] bg-white shadow-sm">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#E30613]" strokeWidth={2.2} />
              <input
                type="text"
                placeholder="Buscar productos"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-white py-2 pl-10 pr-3 text-[14px] text-gray-800 placeholder-gray-400 outline-none"
              />
            </div>
            <button
              type="submit"
              aria-label="Buscar"
              className="flex items-center justify-center bg-[#E30613] px-3.5 text-white transition-colors hover:bg-[#c70510] shrink-0 cursor-pointer"
            >
              <Search className="h-4 w-4 text-white" strokeWidth={2.4} />
            </button>
          </form>
        </div>
      </header>

      {/* Navegación de Categorías Horizontal */}
      <CategoryNavigation 
        categoriesGrouped={categoriesTree}
        selectedCategory={currentCategory} 
        onSelectCategory={handleSelectCategory}
      />

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>

      <WhatsappFloat />

      <Footer />

      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        categoriesGrouped={categoriesTree}
        selectedCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}
