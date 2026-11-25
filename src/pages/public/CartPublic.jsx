import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import ProductImage from "../../components/ui/ProductImage";
import { getWhatsappNumber } from "../../services/settingsService";
import { createPublicWhatsAppPedido } from "../../services/pedidoService";

export default function CartPublic() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [waPhone, setWaPhone] = useState("");
  // Estados del flujo de finalización
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null); // { id, orderCode }
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    getWhatsappNumber().then((num) => setWaPhone(num || ""));
  }, []);

  // Construir mensaje de WhatsApp con el detalle del carrito y el código de pedido
  const buildWhatsAppUrl = useCallback((orderCode = null) => {
    if (!waPhone) return "#";
    const phone = waPhone.replace(/\D/g, "");

    const allUnpriced = cartItems.every((item) => (Number(item.salePrice) || 0) <= 0);
    const hasUnpriced = cartItems.some((item) => (Number(item.salePrice) || 0) <= 0);

    const lines = cartItems.map((item) => {
      const price = Number(item.salePrice) || 0;
      if (price <= 0) {
        return `• ${item.name} x${item.quantity} — *(Consultar precio)*`;
      }
      const subtotal = price * item.quantity;
      return `• ${item.name} x${item.quantity} = ${formatCurrency(subtotal)}`;
    });

    const codeSection = orderCode ? [`📋 *Código de pedido: ${orderCode}*`, ""] : [];

    const header = allUnpriced
      ? "💬 *Hola Casa Karem, quiero consultar por los siguientes productos:*"
      : hasUnpriced
      ? "🛒 *Hola Casa Karem, quiero realizar el siguiente pedido / consulta:*"
      : "🛒 *Hola Casa Karem, quiero realizar el siguiente pedido:*";

    const totalSection = allUnpriced
      ? []
      : [
          "",
          hasUnpriced
            ? `*Subtotal productos con precio: ${formatCurrency(cartTotal)}*`
            : `*Total: ${formatCurrency(cartTotal)}*`,
        ];

    const footer = allUnpriced
      ? "Por favor, confírmenme el precio y disponibilidad. ¡Gracias! 😊"
      : hasUnpriced
      ? "Por favor, confírmenme disponibilidad, precio de los ítems a consultar y forma de pago. ¡Gracias! 😊"
      : "Por favor, confirmen disponibilidad y forma de pago. ¡Gracias! 😊";

    const message = [
      header,
      "",
      ...codeSection,
      ...lines,
      ...totalSection,
      "",
      footer,
    ].join("\n");

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [waPhone, cartItems, cartTotal]);

  // Handler principal: registra el pedido en Firestore y abre WhatsApp
  async function handleFinalizarWhatsApp(e) {
    e.preventDefault();
    if (!waPhone || submitting || cartItems.length === 0) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Registrar el pedido en Firestore
      const result = await createPublicWhatsAppPedido({
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          sku: item.sku || "",
          quantity: item.quantity,
          salePrice: Number(item.salePrice) || 0,
        })),
        total: cartTotal,
      });

      setOrderResult(result);

      // 2. Abrir WhatsApp con el código del pedido incluido
      const url = buildWhatsAppUrl(result.orderCode);
      window.open(url, "_blank", "noopener,noreferrer");

      // 3. Vaciar el carrito
      clearCart();

    } catch (err) {
      console.error("[CartPublic] Error al registrar pedido:", err);
      setSubmitError("No se pudo registrar el pedido. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cartItems.length === 0) {
    // Pantalla: carrito vacío (incluye el caso post-pedido exitoso)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        {orderResult ? (
          // ── Confirmación de pedido enviado ──
          <>
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="mb-1 text-2xl font-bold text-gray-900">¡Pedido enviado!</h2>
            <p className="mb-1 text-gray-500">Tu pedido fue registrado exitosamente.</p>
            <p className="mb-6 rounded-xl bg-[#FCF9F2] border border-[#B88B35]/30 px-6 py-3 text-lg font-bold text-[#8F6820]">
              Código: {orderResult.orderCode}
            </p>
            <p className="mb-8 max-w-sm text-sm text-gray-500 leading-relaxed">
              WhatsApp se abrió con el detalle completo. Enviá el mensaje y te confirmaremos a la brevedad.
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E30613] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#c70510] hover:shadow-md active:scale-95"
            >
              <ShoppingBag className="h-5 w-5" />
              Seguir comprando
            </Link>
          </>
        ) : (
          // ── Carrito vacío normal ──
          <>
            <div className="mb-6 rounded-full bg-gray-50 p-8">
              <ShoppingCart className="h-20 w-20 text-gray-300" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
            <p className="mb-8 text-gray-500">
              Parece que aún no has agregado productos a tu carrito.
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E30613] px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#c70510] hover:shadow-md active:scale-95"
            >
              <ShoppingBag className="h-5 w-5" />
              Continuar comprando
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
          Carrito de Compras
        </h1>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Lado izquierdo: Lista de productos */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          {cartItems.map((item) => {
            // Imagen: item.images[0] puede ser { url, publicId } o string
            const imageSource =
              Array.isArray(item.images) && item.images.length > 0
                ? item.images[0]
                : null;
            // Precio: asegurar conversión a número
            const unitPrice = Number(item.salePrice) || 0;
            const subtotal = unitPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border sm:gap-6 sm:p-5"
              >
                {/* Imagen */}
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-50 sm:h-32 sm:w-32">
                  <ProductImage
                    image={imageSource}
                    type="thumb"
                    thumbSize={128}
                    alt={item.name}
                    eager
                    className="h-full w-full object-cover"
                    wrapperClassName="h-full w-full"
                  />
                </div>

                {/* Info del producto */}
                <div className="flex flex-1 flex-col min-w-0">
                  {/* Nombre + precio en fila */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                        <Link to={`/catalogo/${item.id}`} className="hover:text-primary">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                        {item.categoryName || "Sin categoría"}
                      </p>
                    </div>
                    {unitPrice > 0 ? (
                      <p className="shrink-0 text-sm font-bold text-gray-900 sm:text-base">
                        {formatCurrency(unitPrice)}
                      </p>
                    ) : (
                      <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        A consultar
                      </span>
                    )}
                  </div>

                  {/* Controles + eliminar */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:mt-auto">
                    {/* Selector de cantidad */}
                    <div className="flex items-center gap-1 rounded-lg border border-border bg-gray-50 p-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateQuantity(item.id, item.quantity - 1);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateQuantity(item.id, item.quantity + 1);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Subtotal + Eliminar */}
                    <div className="flex items-center gap-4">
                      {unitPrice > 0 && (
                        <p className="text-sm text-gray-500">
                          Subtotal:{" "}
                          <span className="font-bold text-gray-900">
                            {formatCurrency(subtotal)}
                          </span>
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        className="inline-flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-700"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lado derecho: Resumen */}
        <div className="w-full lg:sticky lg:top-32 lg:w-96 shrink-0">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border sm:p-8">
            <h2 className="text-lg font-bold text-gray-900">Resumen del pedido</h2>

            <div className="mt-6 space-y-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {cartTotal > 0 ? formatCurrency(cartTotal) : "A consultar"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Descuento</span>
                <span className="font-semibold text-gray-900">Gs. 0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Envío</span>
                <span className="font-semibold text-gray-900">A calcular</span>
              </div>

              <div className="my-2 h-px w-full bg-gray-100" />

              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-extrabold text-primary">
                  {cartTotal > 0 ? formatCurrency(cartTotal) : "A consultar"}
                </span>
              </div>
            </div>

            {/* Error de registro */}
            {submitError && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-center text-xs font-medium text-red-600">
                {submitError}
              </p>
            )}

            {/* Botón principal */}
            <button
              onClick={handleFinalizarWhatsApp}
              disabled={!waPhone || submitting}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                waPhone ? "bg-green-500 hover:bg-green-600" : "bg-gray-300"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Registrando pedido…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.748.853 5.302 2.425 7.486L2.514 29.2a.625.625 0 00.763.763l5.714-1.911A13.944 13.944 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="white"/>
                    <path d="M23.098 20.016c-.372 1.043-1.483 1.916-2.555 2.162-.681.156-1.569.282-4.542-1.298-3.807-2.023-6.262-6.989-6.45-7.307-.193-.318-1.536-2.044-1.536-3.9 0-1.856.972-2.767 1.319-3.147.347-.38.756-.475 1.008-.475.253 0 .506.004.726.013.232.009.556-.09.87.666.314.757 1.069 2.623 1.164 2.813.095.19.158.413.031.667-.126.254-.19.413-.38.634-.19.221-.398.493-.572.663-.19.19-.388.396-.166.777.221.381.984 1.624 2.115 2.63 1.451 1.29 2.676 1.691 3.055 1.882.38.19.603.158.824-.095.222-.253.952-1.108 1.207-1.488.254-.38.507-.317.855-.19.348.126 2.21 1.042 2.59 1.233.38.19.632.285.696.444.063.158.063.918-.31 1.96z" fill="rgba(0,0,0,0.3)"/>
                  </svg>
                  Finalizar por WhatsApp
                </>
              )}
            </button>
            <p className="mt-4 text-center text-xs text-gray-500">
              Tu pedido quedará registrado y se abrirá WhatsApp con el detalle listo para enviar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

