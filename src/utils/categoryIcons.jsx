import {
  LayoutGrid,
  Laptop,
  Smartphone,
  MonitorPlay,
  Gamepad2,
  Headphones,
  Cable,
  Printer,
  Camera,
  Monitor,
  Cpu,
  Speaker,
  Keyboard,
  Mouse,
  HardDrive,
  Tablet,
  Watch,
  Armchair,
  Tag,
} from "lucide-react";

/**
 * Ícono de frasco de perfume de lujo (estilo Chanel / flacon clásico).
 * Diseño limpio, estético y simétrico.
 * Compatible con la API de Lucide React (size, className, strokeWidth, props).
 */
export function PerfumeBottleIcon({
  className = "",
  size = 24,
  strokeWidth = 2,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Tapa / Tapón superior facetado */}
      <rect x="9" y="2" width="6" height="4" rx="1" />
      {/* Cuello / Vaporizador */}
      <path d="M10 10V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3" />
      {/* Cuerpo de vidrio del frasco */}
      <rect x="5" y="10" width="14" height="11" rx="2.5" />
      {/* Etiqueta central icónica de fragancia */}
      <rect x="8.5" y="13.5" width="7" height="4.5" rx="0.75" />
    </svg>
  );
}

const CATEGORY_ICON_MAP = {
  notebook: Laptop,
  laptop: Laptop,
  celular: Smartphone,
  telefono: Smartphone,
  smartphone: Smartphone,
  televisor: MonitorPlay,
  tv: MonitorPlay,
  monitor: Monitor,
  gaming: Gamepad2,
  gamer: Gamepad2,
  juego: Gamepad2,
  consola: Gamepad2,
  auricular: Headphones,
  audio: Speaker,
  parlante: Speaker,
  cable: Cable,
  red: Cable,
  impresora: Printer,
  insumo: Printer,
  camara: Camera,
  filmacion: Camera,
  tablet: Tablet,
  procesador: Cpu,
  componente: Cpu,
  teclado: Keyboard,
  mouse: Mouse,
  disco: HardDrive,
  almacenamiento: HardDrive,
  reloj: Watch,
  silla: Armchair,
  mesa: Armchair,
  accesorio: Tag,
  tecnologia: Cpu,
  electrodomestico: Monitor,
  perfume: PerfumeBottleIcon,
  perfumeria: PerfumeBottleIcon,
  fragancia: PerfumeBottleIcon,
  colonia: PerfumeBottleIcon,
  esencia: PerfumeBottleIcon,
  cosmetica: PerfumeBottleIcon,
  belleza: PerfumeBottleIcon,
};

export function getIconForCategory(categoryName) {
  if (!categoryName) return LayoutGrid;
  // Normalizar a minúsculas y sin tildes para máxima tolerancia
  const lower = categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (const [keyword, icon] of Object.entries(CATEGORY_ICON_MAP)) {
    if (lower.includes(keyword)) return icon;
  }
  return LayoutGrid;
}
