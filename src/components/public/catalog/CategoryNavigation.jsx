import { memo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Wrench, ChevronDown } from "lucide-react";
import { getIconForCategory } from "../../../utils/categoryIcons";

function CategoryNavigationBase({ categoriesGrouped = [], selectedCategory, onSelectCategory }) {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0 });
  const hoverTimeout = useRef(null);
  const buttonRefs = useRef({});

  function handleMouseEnter(id) {
    clearTimeout(hoverTimeout.current);
    // Calcular posición del botón para el dropdown fixed
    const btn = buttonRefs.current[id];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setDropdownPos({ left: rect.left, top: rect.bottom + 4 });
    }
    setHoveredItem(id);
  }

  function handleMouseLeave() {
    hoverTimeout.current = setTimeout(() => setHoveredItem(null), 150);
  }

  const navItems = [
    { id: "home", label: "Inicio", icon: Home, action: () => navigate("/catalogo"), subcategories: [] },
    ...categoriesGrouped.map((cat) => ({
      id: cat.name,
      label: cat.name,
      icon: getIconForCategory(cat.name),
      action: () => onSelectCategory(cat.name),
      subcategories: cat.subcategories || [],
    })),
    { id: "servicio", label: "Servicio Técnico", icon: Wrench, action: () => navigate("/servicio-tecnico"), subcategories: [] },
  ];

  const hoveredNavItem = navItems.find((i) => i.id === hoveredItem);

  return (
    <nav className="sticky top-[56px] md:top-[64px] lg:top-[80px] z-40 border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="hide-scrollbar flex items-center gap-0.5 overflow-x-auto py-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === selectedCategory;
            const hasChildren = item.subcategories.length > 0;
            const isHovered = hoveredItem === item.id;

            return (
              <div
                key={item.id}
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                ref={(el) => { buttonRefs.current[item.id] = el; }}
              >
                <button
                  onClick={item.action}
                  className={`relative flex items-center gap-1.5 px-3.5 py-3 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                    isActive
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${isHovered ? "rotate-180" : ""}`}
                    />
                  )}

                  {/* Animated underline */}
                  {(isActive || isHovered) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dropdown renderizado FUERA del contenedor overflow para que no sea recortado */}
      <AnimatePresence>
        {hoveredNavItem && hoveredNavItem.subcategories.length > 0 && (
          <motion.div
            key={hoveredNavItem.id}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{ position: "fixed", left: dropdownPos.left, top: dropdownPos.top }}
            className="z-[9999] min-w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            onMouseEnter={() => {
              clearTimeout(hoverTimeout.current);
              setHoveredItem(hoveredNavItem.id);
            }}
            onMouseLeave={handleMouseLeave}
          >
            {/* Opción "Todos" */}
            <button
              onClick={() => { hoveredNavItem.action(); setHoveredItem(null); }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
            >
              {(() => { const Icon = hoveredNavItem.icon; return <Icon className="h-3.5 w-3.5" />; })()}
              Todos en {hoveredNavItem.label}
            </button>
            <div className="mx-3 border-t border-slate-100" />
            {/* Subcategorías */}
            {hoveredNavItem.subcategories.map((sub) => {
              const SubIcon = getIconForCategory(sub.name);
              return (
                <button
                  key={sub.id}
                  onClick={() => { onSelectCategory(sub.name); setHoveredItem(null); }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${
                    selectedCategory === sub.name ? "font-semibold text-primary" : "text-gray-600"
                  }`}
                >
                  <SubIcon className="h-3.5 w-3.5 text-gray-400" />
                  {sub.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const CategoryNavigation = memo(CategoryNavigationBase);
export default CategoryNavigation;
