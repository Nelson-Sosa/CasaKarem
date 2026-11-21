import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutGrid,
  Smartphone,
  Heart,
  ShoppingCart,
  Mail,
  Clock,
  Info,
  MapPin,
  ShieldCheck,
  Truck,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "../../config/brand";

/* ── Iconos SVG oficiales ─────────────────────────────────────────── */

/** Facebook – logo oficial relleno */
const FacebookIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

/** WhatsApp – logo oficial relleno */
const WhatsAppIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.826L.057 23.886a.5.5 0 0 0 .615.611l6.218-1.635A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.016-1.378l-.36-.214-3.73.981.998-3.642-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
  </svg>
);

/** Instagram – logo oficial relleno */
const InstagramIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

/** TikTok – logo oficial con doble capa cyan/pink */
const TikTokIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.14 8.14 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
);

/* Horarios oficiales ordenados */
const STORE_SCHEDULE = [
  { day: "Lunes", hours: "07:30 – 17:00", dayIndex: 1 },
  { day: "Martes", hours: "07:30 – 17:00", dayIndex: 2 },
  { day: "Miércoles", hours: "07:30 – 17:00", dayIndex: 3 },
  { day: "Jueves", hours: "07:30 – 17:00", dayIndex: 4 },
  { day: "Viernes", hours: "07:30 – 17:00", dayIndex: 5 },
  { day: "Sábado", hours: "07:30 – 17:00", dayIndex: 6 },
  { day: "Domingo", hours: "Cerrado", isClosed: true, dayIndex: 0 },
];

const FooterAccordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-[#B88B35]/20 md:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2.5 md:py-3 md:cursor-default md:py-0"
      >
        <div className="flex flex-col items-start gap-1.5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#9C7428]">
            {title}
          </h3>
          <span className="hidden md:block h-[2px] w-6 rounded-full bg-gradient-to-r from-[#8A641E] via-[#B88B35] to-[#C9A048]" />
        </div>
        <div className="md:hidden text-[#9C7428]">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 md:max-h-none md:!block ${isOpen ? 'max-h-96 pb-2.5 md:pb-3' : 'max-h-0'}`}>
        <div className="md:pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Footer() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const todayIndex = new Date().getDay();

  const handleNav = (targetPath, scrollToElId = null) => (e) => {
    const isSamePath = location.pathname === targetPath;

    if (scrollToElId) {
      if (isSamePath) {
        e.preventDefault();
        const el = document.getElementById(scrollToElId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      } else {
        e.preventDefault();
        navigate(targetPath);
        setTimeout(() => {
          const el = document.getElementById(scrollToElId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 150);
        return;
      }
    }

    if (isSamePath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  // Cerrar modal con tecla Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsAboutModalOpen(false);
        setIsScheduleModalOpen(false);
      }
    }
    if (isAboutModalOpen || isScheduleModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAboutModalOpen, isScheduleModalOpen]);

  return (
    <footer className="relative bg-white text-gray-800 shadow-sm border-t border-gray-100">
      
      {/* Moldura superior con degradado dorado metálico */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#8A641E] via-[#C9A048] to-[#8A641E]" />

      {/* Top Main Section */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-5 sm:px-6 md:py-8 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6 lg:gap-12">
          
          {/* 1. Brand & Socials */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4 md:gap-6 md:col-span-1">
            <div className="flex flex-col items-center md:items-start gap-1.5">
              <Link
                to="/catalogo"
                onClick={handleNav("/catalogo")}
                className="text-2xl sm:text-3xl font-black uppercase tracking-[0.16em] bg-gradient-to-r from-[#8A641E] via-[#B88B35] to-[#8A641E] bg-clip-text text-transparent hover:brightness-110 transition-all select-none drop-shadow-xs"
              >
                Casa Karem
              </Link>
              
              {/* Placa elegante dorada 'Electrónica • Perfumes' */}
              <div className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#FCF9F2] border border-[#B88B35]/60 shadow-xs">
                <span className="text-[10.5px] font-semibold tracking-[0.24em] text-[#8F6820] uppercase select-none">
                  Electrónica • Perfumes
                </span>
              </div>

              <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-xs font-normal">
                Tecnología, productos y soluciones para vos.
              </p>
            </div>
            
            {/* Social Buttons */}
            <div className="flex items-center gap-2.5 md:gap-3">

              {/* Facebook */}
              <motion.a
                href="https://www.facebook.com/casakaremsrl?mibextid=wwXIfr&rdid=plIShMkTr1uLOelm&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1GxMUZMXzx%2F%3Fmibextid%3DwwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ backgroundColor: "#1877F2" }}
                className="relative flex items-center justify-center rounded-full p-2 md:p-2.5 text-white shadow-md overflow-hidden"
                whileHover={{ scale: 1.18, boxShadow: "0 0 16px 4px #1877F288" }}
                whileTap={{ scale: 0.93 }}
                animate={{ boxShadow: ["0 0 0px 0px #1877F200", "0 0 8px 2px #1877F244", "0 0 0px 0px #1877F200"] }}
                transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, scale: { type: "spring", stiffness: 350, damping: 15 } }}
              >
                <FacebookIcon size={19} />
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                style={{ backgroundColor: "#25D366" }}
                className="relative flex items-center justify-center rounded-full p-2 md:p-2.5 text-white shadow-md overflow-hidden"
                whileHover={{ scale: 1.18, boxShadow: "0 0 16px 4px #25D36688" }}
                whileTap={{ scale: 0.93 }}
                animate={{ boxShadow: ["0 0 0px 0px #25D36600", "0 0 8px 2px #25D36644", "0 0 0px 0px #25D36600"] }}
                transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }, scale: { type: "spring", stiffness: 350, damping: 15 } }}
              >
                <WhatsAppIcon size={19} />
              </motion.a>

              {/* Instagram */}
              <motion.a
                href="https://www.instagram.com/casakaremsrl?dmpr=enF2dWY3bjI1cXZ5&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="relative flex items-center justify-center rounded-full p-2 md:p-2.5 text-white shadow-md overflow-hidden"
                style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
                whileHover={{ scale: 1.18, boxShadow: "0 0 16px 4px #e6683c88", rotate: 8 }}
                whileTap={{ scale: 0.93 }}
                animate={{ boxShadow: ["0 0 0px 0px #dc274300", "0 0 8px 2px #dc274344", "0 0 0px 0px #dc274300"] }}
                transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }, scale: { type: "spring", stiffness: 350, damping: 15 }, rotate: { type: "spring", stiffness: 300 } }}
              >
                <InstagramIcon size={19} />
              </motion.a>

              {/* TikTok */}
              <motion.a
                href="https://www.tiktok.com/@casa.karemsrl1?_r=1&_t=ZS-9BW2ANKrSIE"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="relative flex items-center justify-center rounded-full p-2 md:p-2.5 text-white shadow-md overflow-hidden"
                style={{ background: "#010101" }}
                whileHover={{ scale: 1.18, boxShadow: "0 0 10px 3px #69C9D0aa, 0 0 18px 5px #EE1D5244" }}
                whileTap={{ scale: 0.93 }}
                animate={{ boxShadow: ["0 0 0px 0px #69C9D000", "0 0 6px 2px #69C9D033", "0 0 0px 0px #69C9D000"] }}
                transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }, scale: { type: "spring", stiffness: 350, damping: 15 } }}
              >
                <span className="relative drop-shadow-[1px_1px_0_#EE1D52] drop-shadow-[-1px_-1px_0_#69C9D0]">
                  <TikTokIcon size={19} />
                </span>
              </motion.a>

            </div>
          </div>

          {/* 2. Tienda */}
          <FooterAccordion title="Tienda" defaultOpen={true}>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-2 md:flex md:flex-col md:gap-3">
              <li>
                <Link
                  to="/catalogo"
                  onClick={handleNav("/catalogo")}
                  className="group flex items-center gap-2 text-sm text-gray-700 font-medium transition-all hover:text-[#9C7428] hover:translate-x-1 duration-150"
                >
                  <LayoutGrid size={16} className="text-[#B88B35] shrink-0 transition-transform group-hover:scale-110" /> Catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  onClick={handleNav("/catalogo", "catalogo-completo")}
                  className="group flex items-center gap-2 text-sm text-gray-700 font-medium transition-all hover:text-[#9C7428] hover:translate-x-1 duration-150"
                >
                  <Smartphone size={16} className="text-[#B88B35] shrink-0 transition-transform group-hover:scale-110" /> Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo/favoritos"
                  onClick={handleNav("/catalogo/favoritos")}
                  className="group flex items-center gap-2 text-sm text-gray-700 font-medium transition-all hover:text-[#9C7428] hover:translate-x-1 duration-150"
                >
                  <Heart size={16} className="text-[#B88B35] shrink-0 transition-transform group-hover:scale-110" /> Favoritos
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo/carrito"
                  onClick={handleNav("/catalogo/carrito")}
                  className="group flex items-center gap-2 text-sm text-gray-700 font-medium transition-all hover:text-[#9C7428] hover:translate-x-1 duration-150"
                >
                  <ShoppingCart size={16} className="text-[#B88B35] shrink-0 transition-transform group-hover:scale-110" /> Carrito
                </Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* 3. Atención al Cliente */}
          <FooterAccordion title="Atención al cliente">
            <ul className="flex flex-col gap-2.5 md:gap-3">
              <li>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-gray-700 font-medium transition-all hover:text-[#9C7428] hover:translate-x-1 duration-150"
                >
                  <Mail size={16} className="text-[#B88B35] shrink-0 transition-transform group-hover:scale-110" />
                  <span>Contacto</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="group flex items-center gap-2 text-sm text-gray-700 font-medium transition-all hover:text-[#9C7428] hover:translate-x-1 duration-150 text-left cursor-pointer"
                >
                  <Clock size={16} className="text-[#B88B35] shrink-0 transition-transform group-hover:scale-110" />
                  <span>Horarios de atención</span>
                </button>
              </li>
            </ul>
          </FooterAccordion>

          {/* 4. Información */}
          <FooterAccordion title="Información">
            <ul className="flex flex-col gap-2.5 md:gap-3">
              <li>
                <button
                  type="button"
                  onClick={() => setIsAboutModalOpen(true)}
                  className="group flex items-center gap-2 text-sm text-gray-700 font-medium transition-all hover:text-[#9C7428] hover:translate-x-1 duration-150 text-left cursor-pointer"
                >
                  <Info size={16} className="text-[#B88B35] shrink-0 transition-transform group-hover:scale-110" />
                  <span>Sobre nosotros</span>
                </button>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/3um24Kn7n49CH5bbA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-gray-700 font-medium transition-all hover:text-[#9C7428] hover:translate-x-1 duration-150"
                >
                  <MapPin size={16} className="text-[#B88B35] shrink-0 transition-transform group-hover:scale-110" />
                  <span>Ubicación del local</span>
                </a>
              </li>
            </ul>
          </FooterAccordion>

        </div>

        {/* Mobile Info Badges */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 md:hidden">
           <div className="flex items-center gap-3 rounded-xl bg-[#FCF9F2] border border-[#B88B35]/30 p-3 shadow-sm">
              <ShieldCheck className="text-[#9C7428] shrink-0" size={18} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-800">Compra 100% segura</p>
                <p className="text-xs text-gray-500">Protegemos tus datos</p>
              </div>
           </div>
           <div className="flex items-center gap-3 rounded-xl bg-[#FCF9F2] border border-[#B88B35]/30 p-3 shadow-sm">
              <Truck className="text-[#9C7428] shrink-0" size={18} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-800">Envíos a todo el país</p>
                <p className="text-xs text-gray-500">Rápidos y confiables</p>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Bar — Separada con línea dorada sutil sobre fondo blanco */}
      <div className="relative z-10 border-t border-[#B88B35]/25 bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-4 py-3.5 md:py-5 md:flex-row sm:px-6 lg:px-8">
          
          <div className="text-center md:text-left">
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-[#9C7428]">{BRAND.name}</span>. Todos los derechos reservados.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-sm text-[#9C7428] font-semibold md:flex">
             <ShieldCheck size={19} className="text-[#9C7428]" />
             <span>Sitio 100% protegido por SSL</span>
          </div>

        </div>
      </div>

      {/* Modal Sobre Nosotros */}
      <AnimatePresence>
        {isAboutModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop con desenfoque suave */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Tarjeta del diálogo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#B88B35]/40"
            >
              {/* Moldura superior con destello dorado */}
              <div className="h-[3px] w-full bg-gradient-to-r from-[#8A641E] via-[#C9A048] to-[#8A641E]" />

              <div className="p-6 sm:p-7 text-center">
                {/* Botón Cerrar (X) */}
                <button
                  onClick={() => setIsAboutModalOpen(false)}
                  className="absolute right-3.5 top-3.5 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </button>

                {/* Medallón de Marca */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FFFDF7] to-[#F3E5C8] border-2 border-[#B88B35] shadow-md">
                  <img
                    src="/logo-casa-karem-circulo.webp"
                    alt="Casa Karem"
                    className="h-12 w-12 object-contain"
                  />
                </div>

                <h3 className="text-xl font-black uppercase tracking-[0.14em] text-gray-900">
                  Sobre Nosotros
                </h3>
                
                <div className="inline-flex items-center px-3 py-0.5 mt-1.5 rounded-full bg-[#FCF9F2] border border-[#B88B35]/50">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#8F6820] uppercase">
                    Casa Karem • Desde 1992
                  </span>
                </div>

                <div className="my-4 h-px w-20 mx-auto bg-gradient-to-r from-transparent via-[#B88B35] to-transparent" />

                {/* Mensaje oficial */}
                <p className="text-[15px] sm:text-base leading-relaxed text-gray-700 font-medium px-2">
                  Desde 1992, acercándote lo mejor en electrónica y perfumería, con calidad, confianza y atención cercana. ¡Gracias por ser parte de nuestra historia!
                </p>

                {/* Botón de acción */}
                <div className="mt-6">
                  <button
                    onClick={() => setIsAboutModalOpen(false)}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8A641E] via-[#B88B35] to-[#8A641E] text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Horarios de Atención */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop con desenfoque suave */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScheduleModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Tarjeta del diálogo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-[#B88B35]/40"
            >
              {/* Moldura superior con destello dorado */}
              <div className="h-[3px] w-full bg-gradient-to-r from-[#8A641E] via-[#C9A048] to-[#8A641E]" />

              <div className="p-6 sm:p-7 text-center">
                {/* Botón Cerrar (X) */}
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="absolute right-3.5 top-3.5 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </button>

                {/* Medallón con Ícono de Reloj Dorado */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FFFDF7] to-[#F3E5C8] border-2 border-[#B88B35] shadow-md">
                  <Clock className="h-8 w-8 text-[#8F6820]" />
                </div>

                <h3 className="text-xl font-black uppercase tracking-[0.14em] text-gray-900">
                  Horarios de Atención
                </h3>
                
                <div className="inline-flex items-center px-3 py-0.5 mt-1.5 rounded-full bg-[#FCF9F2] border border-[#B88B35]/50">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#8F6820] uppercase">
                    Casa Karem • Tienda Física
                  </span>
                </div>

                <div className="my-4 h-px w-20 mx-auto bg-gradient-to-r from-transparent via-[#B88B35] to-transparent" />

                {/* Tabla ordenada y nítida */}
                <div className="rounded-xl bg-[#FCF9F2] p-3 sm:p-3.5 border border-[#B88B35]/30 text-xs sm:text-sm shadow-xs space-y-1 text-left">
                  {STORE_SCHEDULE.map((item) => {
                    const isToday = item.dayIndex === todayIndex;
                    return (
                      <div
                        key={item.day}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-colors ${
                          isToday
                            ? "bg-[#B88B35]/15 font-bold text-gray-900 ring-1 ring-[#B88B35]/35"
                            : "text-gray-700"
                        } ${item.isClosed ? "border-t border-[#B88B35]/20 mt-1.5 pt-2" : ""}`}
                      >
                        <span className="flex items-center gap-2">
                          {isToday && (
                            <span
                              className="h-2 w-2 rounded-full bg-[#10B981] shrink-0 animate-pulse"
                              title="Hoy"
                            />
                          )}
                          <span>{item.day}</span>
                          {isToday && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] ml-0.5">
                              (Hoy)
                            </span>
                          )}
                        </span>
                        <span
                          className={
                            item.isClosed
                              ? "font-extrabold text-[#E30613]"
                              : "font-bold text-gray-900"
                          }
                        >
                          {item.hours}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Botón de acción */}
                <div className="mt-6">
                  <button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8A641E] via-[#B88B35] to-[#8A641E] text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
