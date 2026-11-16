import { useState, useRef } from "react";
import { Plus, X, Tag } from "lucide-react";
import { sanitizeText } from "../../utils/productValidation";

// Common variant types for electronics and perfumes
const VARIANT_TYPES = [
  { name: "Color", icon: "🎨" },
];

export default function ProductAttributes({ attributes = [], onChange, errors }) {
  const [inputValues, setInputValues] = useState({});
  const inputRefs = useRef({});

  // Add new variant type with empty values array
  function addVariantType(variantName) {
    const exists = attributes.find((a) => a.name === variantName);
    if (exists) return;
    onChange([...attributes, { name: variantName, values: [] }]);
    setInputValues((prev) => ({ ...prev, [variantName]: "" }));
  }

  // Add value to a variant type
  function addValueToVariant(attrIndex, value) {
    const trimmed = sanitizeText(value);
    if (!trimmed) return;

    const attr = attributes[attrIndex];
    const isDuplicate = attr.values.some(
      (v) => v.toLowerCase() === trimmed.toLowerCase()
    );

    if (isDuplicate) {
      alert("Este valor ya existe en esta variante");
      return;
    }

    const next = attributes.map((a, i) =>
      i === attrIndex ? { ...a, values: [...a.values, trimmed] } : a
    );
    onChange(next);
    setInputValues((prev) => ({ ...prev, [attr.name]: "" }));
  }

  // Remove value from variant type
  function removeValue(attrIndex, valIndex) {
    const next = attributes.map((a, i) => {
      if (i !== attrIndex) return a;
      return { ...a, values: a.values.filter((_, j) => j !== valIndex) };
    });
    onChange(next);
  }

  // Remove entire variant type
  function removeVariant(index) {
    const attr = attributes[index];
    onChange(attributes.filter((_, i) => i !== index));
    setInputValues((prev) => {
      const next = { ...prev };
      delete next[attr.name];
      return next;
    });
  }

  // Handle Enter key to add value
  function handleKeyPress(e, attrIndex) {
    if (e.key === "Enter") {
      e.preventDefault();
      const attr = attributes[attrIndex];
      addValueToVariant(attrIndex, inputValues[attr.name] || "");
    }
  }

  return (
    <div className="space-y-4">
      {/* Show variants if they exist */}
      {attributes.length > 0 && (
        <div className="space-y-3">
          {attributes.map((attr, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
              {/* Variant type header */}
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">{attr.name}</h4>
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="rounded-lg p-1 text-gray-400 transition-colors hover:text-red-500"
                  title="Eliminar variante"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Variant values as chips */}
              <div className="mb-3 flex flex-wrap gap-2">
                {attr.values.map((val, j) => (
                  <div
                    key={j}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {val}
                    <button
                      type="button"
                      onClick={() => removeValue(i, j)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                      title="Eliminar valor"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Input to add new value */}
              <div className="flex gap-2">
                <input
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  value={inputValues[attr.name] || ""}
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      [attr.name]: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  placeholder={`Ej: ${attr.name === "Color" ? "Negro, Blanco" : attr.name === "Capacidad" ? "128GB, 256GB" : "Ingresa valor"}`}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    addValueToVariant(i, inputValues[attr.name] || "");
                    inputRefs.current[i]?.focus();
                  }}
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Agregar
                </button>
              </div>

              {errors?.[i] && (
                <p className="mt-2 text-xs text-red-500">{errors[i]}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add variant type buttons */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {attributes.length > 0 ? "Agregar otra variante:" : "¿Tu producto tiene variantes?"}
        </p>
        <div className="flex flex-wrap gap-2">
          {VARIANT_TYPES.map((type) => {
            const isAdded = attributes.some((a) => a.name === type.name);
            return (
              <button
                key={type.name}
                type="button"
                onClick={() => addVariantType(type.name)}
                disabled={isAdded}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isAdded
                    ? "border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "border border-dashed border-gray-300 bg-white text-gray-600 hover:border-primary hover:text-primary"
                }`}
              >
                <span>{type.icon}</span>
                {type.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty state hint */}
      {attributes.length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            Las variantes son opcionales. Si tu producto tiene diferentes colores,
            capacidades o tamaños, agrégalas aquí.
          </p>
        </div>
      )}
    </div>
  );
}
