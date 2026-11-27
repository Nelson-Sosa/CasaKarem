import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AdminRoute from "./routes/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import lazyWithRetry from "./utils/lazyWithRetry";
import PublicLayout from "./components/public/PublicLayout";
import Catalog from "./pages/public/Catalog";
import ProductPublicDetail from "./pages/public/ProductPublicDetail";

const AdminLayout = lazyWithRetry(() => import("./components/layout/AdminLayout"));
const Login = lazyWithRetry(() => import("./pages/auth/Login"));
const Register = lazyWithRetry(() => import("./pages/auth/Register"));
const Dashboard = lazyWithRetry(() => import("./pages/admin/Dashboard"));
const Products = lazyWithRetry(() => import("./pages/admin/Products"));
const ProductDetail = lazyWithRetry(() => import("./pages/admin/ProductDetail"));
const Categories = lazyWithRetry(() => import("./pages/admin/Categories"));

const Clients = lazyWithRetry(() => import("./pages/admin/Clients"));
const ClientDetail = lazyWithRetry(() => import("./pages/admin/ClientDetail"));
const Pedidos = lazyWithRetry(() => import("./pages/admin/Pedidos"));
const CartPublic = lazyWithRetry(() => import("./pages/public/CartPublic"));
const Wishlist = lazyWithRetry(() => import("./pages/public/Wishlist"));
const NotFound = lazyWithRetry(() => import("./pages/public/NotFound"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Toaster position="top-right" />
              <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/catalogo" replace />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="productos" element={<Products />} />
              <Route path="productos/:id" element={<ProductDetail />} />
              <Route path="categorias" element={<Categories />} />
              <Route path="ventas" element={<Navigate to="/admin/pedidos" replace />} />
              <Route path="historial" element={<Navigate to="/admin/pedidos" replace />} />
              <Route path="clientes" element={<Clients />} />
              <Route path="clientes/:id" element={<ClientDetail />} />
              <Route path="pedidos" element={<Pedidos />} />
            </Route>

            <Route path="/catalogo" element={<PublicLayout />}>
              <Route index element={<Catalog />} />
              <Route path="carrito" element={<CartPublic />} />
              <Route path="favoritos" element={<Wishlist />} />
              <Route path=":id" element={<ProductPublicDetail />} />
            </Route>

            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Página 404 para cualquier ruta inexistente */}
            <Route element={<PublicLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
            </Suspense>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
