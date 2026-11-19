/**
 * LogoMonogramaCK — Componente oficial de máxima nitidez
 *
 * Renderiza el logo circular oficial de Casa Karem con fondo transparente al exterior
 * y el texto oficial "CASA KAREM" integrado en alta resolución.
 */

export default function LogoMonogramaCK({
  className = "w-full h-full",
  alt = "Casa Karem",
}) {
  return (
    <img
      src="/logo-casa-karem-circulo.webp"
      alt={alt}
      loading="eager"
      width={160}
      height={160}
      className={`object-contain select-none pointer-events-none [image-rendering:-webkit-optimize-contrast] ${className}`}
      draggable={false}
    />
  );
}
