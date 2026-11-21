import { memo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { getIconForCategory } from "../../../utils/categoryIcons";

function CategoryNavigationBase({ categoriesGrouped = [], selectedCategory, onSelectCategory }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0 });
  const hoverTimeout = useRef(null);
  const buttonRefs = useRef({});

  function handleMouseEnter(id) {
    clearTimeout(hoverTimeout.current);
    const btn = buttonRefs.current[id];
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setDropdownPos({ left: rect.left, top: rect.bottom + 6 });
    }
    setHoveredItem(id);
  }

  function handleMouseLeave() {
    hoverTimeout.current = setTimeout(() => setHoveredItem(null), 150);
  }

  const isAllActive = !selectedCategory || selectedCategory === "all";

  // Categorías principales para la barra
  const categoryItems = categoriesGrouped.map((cat) => ({
    id: cat.name,
    label: cat.name,
    action: () => onSelectCategory(cat.name),
    subcategories: cat.subcategories || [],
  }));

  const hoveredNavItem =
    hoveredItem === "all"
      ? {
          id: "all",
          label: "todas las categorías",
          action: () => onSelectCategory("all"),
          subcategories: categoriesGrouped,
        }
      : categoryItems.find((i) => i.id === hoveredItem);

  return (
    <nav className="sticky top-[64px] md:top-[80px] z-40 bg-[#E30613] shadow-md border-b border-[#c70510]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="hide-scrollbar flex items-center gap-2.5 sm:gap-4 lg:gap-6 overflow-x-auto py-2">
          
          {/* Botón blanco 'Categorías' */}
          <div
            className="relative shrink-0"
            onMouseEnter={() => handleMouseEnter("all")}
            onMouseLeave={handleMouseLeave}
            ref={(el) => { buttonRefs.current["all"] = el; }}
          >
            <button
              onClick={() => onSelectCategory("all")}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-[4px] bg-white text-[#E30613] font-bold text-xs sm:text-sm shadow-sm transition-all duration-150 hover:bg-gray-100 active:scale-95 select-none cursor-pointer ${
                isAllActive ? "ring-2 ring-white/70 shadow" : ""
              }`}
            >
              <span>Categorías</span>
              {categoriesGrouped.length > 0 && (
                <ChevronDown
                  className={`hidden lg:block h-3.5 w-3.5 text-[#E30613] transition-transform duration-200 ${
                    hoveredItem === "all" ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
          </div>

          {/* Lista de categorías con texto blanco sobre fondo rojo */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 shrink-0">
            {categoryItems.map((item) => {
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
                    className={`relative flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold transition-all duration-150 whitespace-nowrap select-none cursor-pointer rounded-[4px] ${
                      isActive
                        ? "text-white bg-white/25 shadow-inner"
                        : "text-white/95 hover:text-white hover:bg-white/15"
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasChildren && (
                      <ChevronDown
                        className={`hidden lg:block h-3 w-3 text-white/80 transition-transform duration-200 ${
                          isHovered ? "rotate-180 text-white" : ""
                        }`}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Dropdown renderizado con posición fija para evitar recortes - SOLO DESKTOP */}
      <AnimatePresence>
        {hoveredNavItem && hoveredNavItem.subcategories.length > 0 && (
          <motion.div
            key={hoveredNavItem.id}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{ position: "fixed", left: dropdownPos.left, top: dropdownPos.top }}
            className="hidden lg:block z-[9999] min-w-[210px] max-h-[380px] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 shadow-2xl"
            onMouseEnter={() => {
              clearTimeout(hoverTimeout.current);
              setHoveredItem(hoveredNavItem.id);
            }}
            onMouseLeave={handleMouseLeave}
          >
            {/* Botón de acceso a toda la sección */}
            <button
              onClick={() => {
                hoveredNavItem.action();
                setHoveredItem(null);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs sm:text-sm font-bold text-[#E30613] transition-colors hover:bg-red-50"
            >
              Ver {hoveredNavItem.label}
            </button>
            <div className="mx-3 my-1 border-t border-slate-100" />
            
            {/* Listado de subcategorías */}
            {hoveredNavItem.subcategories.map((sub) => {
              const SubIcon = getIconForCategory(sub.name);
              return (
                <button
                  key={sub.id || sub.name}
                  onClick={() => {
                    onSelectCategory(sub.name);
                    setHoveredItem(null);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left text-xs sm:text-sm transition-colors hover:bg-red-50/70 hover:text-[#E30613] ${
                    selectedCategory === sub.name
                      ? "font-bold text-[#E30613] bg-red-50"
                      : "text-gray-700"
                  }`}
                >
                  <SubIcon className="h-3.5 w-3.5 text-gray-400" />
                  <span>{sub.name}</span>
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
