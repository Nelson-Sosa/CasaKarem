import { Link } from "react-router-dom";
import { 
  LayoutGrid,
  Smartphone,
  Heart,
  ShoppingCart,
  Search,
  Mail,
  Clock,
  Info,
  FileText,
  Shield,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Truck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { BRAND } from "../../config/brand";

/* ── Iconos SVG oficiales ─────────────────────────────────────────── */

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

const FooterAccordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-800 md:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 md:cursor-default md:py-0"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
          {title}
        </h3>
        <div className="md:hidden text-gray-400">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 md:max-h-none md:!block ${isOpen ? 'max-h-96 pb-3' : 'max-h-0'}`}>
        <div className="md:pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top Main Section */}
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:gap-12">
          
          {/* 1. Brand & Socials */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-5 md:gap-6 md:col-span-1">
            <div className="flex flex-col items-center md:items-start gap-2 md:gap-3">
              <Link
                to="/"
                className="text-xl sm:text-2xl font-bold uppercase tracking-[0.16em] text-white hover:opacity-90 transition-opacity select-none"
              >
                Casa Karem
              </Link>
              <p className="text-sm text-gray-400 max-w-xs">
                Tecnología, productos y soluciones para vos.
              </p>
            </div>
            
            {/* Social Buttons – brand colors + animations */}
            <div className="flex items-center gap-3">

              {/* WhatsApp */}
              <motion.a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                style={{ backgroundColor: "#25D366" }}
                className="relative flex items-center justify-center rounded-full p-2.5 text-white overflow-hidden"
                whileHover={{ scale: 1.18, boxShadow: "0 0 18px 4px #25D36688" }}
                whileTap={{ scale: 0.93 }}
                animate={{ boxShadow: ["0 0 0px 0px #25D36600", "0 0 10px 3px #25D36644", "0 0 0px 0px #25D36600"] }}
                transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, scale: { type: "spring", stiffness: 350, damping: 15 } }}
              >
                <WhatsAppIcon size={20} />
              </motion.a>

              {/* Instagram */}
              <motion.a
                href="https://www.instagram.com/casakaremsrl?dmpr=enF2dWY3bjI1cXZ5&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="relative flex items-center justify-center rounded-full p-2.5 text-white overflow-hidden"
                style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
                whileHover={{ scale: 1.18, boxShadow: "0 0 18px 4px #e6683c88", rotate: 8 }}
                whileTap={{ scale: 0.93 }}
                animate={{ boxShadow: ["0 0 0px 0px #dc274300", "0 0 10px 3px #dc274344", "0 0 0px 0px #dc274300"] }}
                transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }, scale: { type: "spring", stiffness: 350, damping: 15 }, rotate: { type: "spring", stiffness: 300 } }}
              >
                <InstagramIcon size={20} />
              </motion.a>

              {/* TikTok */}
              <motion.a
                href="https://www.tiktok.com/@casa.karemsrl1?_r=1&_t=ZS-9BW2ANKrSIE"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="relative flex items-center justify-center rounded-full p-2.5 text-white overflow-hidden"
                style={{ background: "#010101" }}
                whileHover={{ scale: 1.18, boxShadow: "0 0 10px 3px #69C9D0aa, 0 0 20px 6px #EE1D5244" }}
                whileTap={{ scale: 0.93 }}
                animate={{ boxShadow: ["0 0 0px 0px #69C9D000", "0 0 8px 2px #69C9D033", "0 0 0px 0px #69C9D000"] }}
                transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }, scale: { type: "spring", stiffness: 350, damping: 15 } }}
              >
                {/* Efecto dual-color TikTok (cyan + pink sombra) */}
                <span className="relative drop-shadow-[1px_1px_0_#EE1D52] drop-shadow-[-1px_-1px_0_#69C9D0]">
                  <TikTokIcon size={20} />
                </span>
              </motion.a>

            </div>
          </div>

          {/* 2. Tienda */}
          <FooterAccordion title="Tienda" defaultOpen={true}>
            <ul className="grid grid-cols-2 gap-y-3 gap-x-2 md:flex md:flex-col md:gap-3">
              <li>
                <Link to="/catalogo" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <LayoutGrid size={16} /> Catálogo
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Smartphone size={16} /> Productos
                </Link>
              </li>
              <li>
                <Link to="/catalogo/favoritos" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Heart size={16} /> Favoritos
                </Link>
              </li>
              <li>
                <Link to="/catalogo/carrito" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <ShoppingCart size={16} /> Carrito
                </Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* 3. Atención al Cliente */}
          <FooterAccordion title="Atención al cliente">
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Mail size={16} /> Contacto
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={16} /> Horarios de atención
                </span>
              </li>
            </ul>
          </FooterAccordion>

          {/* 4. Información */}
          <FooterAccordion title="Información">
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Info size={16} /> Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <FileText size={16} /> Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Shield size={16} /> Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <RefreshCw size={16} /> Política de cambios
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <HelpCircle size={16} /> Preguntas frecuentes
                </a>
              </li>
            </ul>
          </FooterAccordion>

        </div>

        {/* Mobile Info Badges (Shown only on small screens for reference) */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
           <div className="flex items-center gap-3 rounded-lg bg-gray-800/40 p-3.5">
              <ShieldCheck className="text-primary-light shrink-0" size={22} />
              <div>
                <p className="text-sm font-medium text-white">Compra 100% segura</p>
                <p className="text-xs text-gray-400">Protegemos tus datos</p>
              </div>
           </div>
           <div className="flex items-center gap-3 rounded-lg bg-gray-800/40 p-3.5">
              <Truck className="text-primary-light shrink-0" size={22} />
              <div>
                <p className="text-sm font-medium text-white">Envíos a todo el país</p>
                <p className="text-xs text-gray-400">Rápidos y confiables</p>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-6 px-4 py-6 md:flex-row sm:px-6 lg:px-8">
          
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.
            </p>
          </div>


          <div className="hidden items-center gap-2 text-sm text-gray-400 md:flex">
             <ShieldCheck size={18} className="text-primary-light" />
             <span>Sitio protegido por SSL</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
