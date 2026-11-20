import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const mainNav = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },

  { name: "Pedidos", href: "/admin/pedidos", icon: ClipboardList },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Productos", href: "/admin/productos", icon: Package },
  { name: "Categorías", href: "/admin/categorias", icon: Tags },
];


export default function Sidebar({ collapsed, mobileOpen, onClose, onToggle }) {
  const { logout } = useAuth();
  const { pathname } = useLocation();

  function NavItem({ item, disabled }) {
    const isActive = item.href && pathname === item.href;

    if (disabled) {
      return (
        <div className="group relative flex cursor-not-allowed items-center rounded-lg px-3 py-3 text-sm text-gray-500 select-none">
          <div className="flex w-6 shrink-0 items-center justify-center">
            <item.icon className="h-5 w-5 text-gray-400" />
          </div>
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? "max-w-0 opacity-0" : "ml-3 max-w-40 opacity-100"
              }`}
          >
            {item.name}
          </span>
          {!collapsed && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-medium text-primary">
              <Lock className="h-3 w-3" />
              Disponible próximamente
            </span>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={item.href}
        className={({ isActive: active }) =>
          `group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
            active
              ? "bg-[#FCF9F2] text-[#8F6820] font-semibold shadow-xs"
              : "text-gray-700 hover:bg-[#FCF9F2]/60 hover:text-[#8F6820]"
          } ${collapsed ? "px-3 py-3 justify-center" : "px-3 py-3"}`
        }
      >
        {({ isActive: active }) => (
          <>
            {active && (
              <div className="absolute left-0 top-1/2 h-3/4 w-[3.5px] -translate-y-1/2 rounded-r-full bg-[#B88B35]" />
            )}
            <div className="flex w-6 shrink-0 items-center justify-center">
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  active ? "text-[#8F6820]" : "text-gray-500 group-hover:text-[#8F6820]"
                }`}
              />
            </div>
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                collapsed ? "max-w-0 opacity-0" : "ml-3 max-w-40 opacity-100"
              }`}
            >
              {item.name}
            </span>
          </>
        )}
      </NavLink>
    );
  }

  function SectionLabel({ text }) {
    return (
      <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        <span
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
            }`}
        >
          {text}
        </span>
      </div>
    );
  }

  function SidebarContent() {
    return (
      <div className="flex h-full flex-col bg-white">
        <div className={`flex h-16 shrink-0 items-center border-b border-border/70 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
          {collapsed ? (
            <Link
              to="/admin/dashboard"
              className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-[#8C6010] via-[#D4AF37] to-[#8C6010] bg-clip-text text-transparent hover:opacity-90"
              title="Casa Karem"
            >
              CK
            </Link>
          ) : (
            <Link
              to="/admin/dashboard"
              className="group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg transition-opacity hover:opacity-90"
            >
              <span className="uppercase tracking-[0.16em] text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-[#8C6010] via-[#D4AF37] to-[#8C6010] bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(140,96,16,0.18)] select-none whitespace-nowrap [text-rendering:optimizeLegibility]">
                Casa Karem
              </span>
            </Link>
          )}
          {mobileOpen && (
            <button
              onClick={onClose}
              className="ml-auto rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#FCF9F2] hover:text-[#8F6820] lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <SectionLabel text="Navegación" />
          {mainNav.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}


        </nav>

        <div className="border-t border-border/70 px-3 py-3">
          <button
            onClick={onToggle}
            className="hidden w-full items-center justify-center rounded-lg px-3 py-2.5 text-gray-500 transition-colors hover:bg-[#FCF9F2] hover:text-[#8F6820] lg:flex"
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={() => { logout(); }}
            className="mt-1 flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <div className="flex w-6 shrink-0 items-center justify-center">
              <LogOut className="h-5 w-5" />
            </div>
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? "max-w-0 opacity-0" : "ml-3 max-w-40 opacity-100"
                }`}
            >
              Cerrar sesión
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border shadow-sm transition-all duration-300 max-lg:data-[state=closed]:-translate-x-full ${collapsed ? "lg:w-16" : "lg:w-72"
          }`}
        data-state={mobileOpen ? "open" : "closed"}
      >
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
