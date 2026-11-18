import { useState } from "react";
import {
  sanitizeName,
  sanitizeDescription,
  validateName,
  validateDescription,
} from "../../utils/categoryValidation";

function buildInitial(initialData) {
  return initialData
    ? {
        name: initialData.name || "",
        description: initialData.description || "",
        status: initialData.status || "active",
        parentId: initialData.parentId || "",
      }
    : { name: "", description: "", status: "active", parentId: "" };
}

export default function CategoryForm({ initialData, parentCategories = [], onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(() => buildInitial(initialData));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(field, value) {
    const next = { ...form, [field]: value };
    setForm(next);

    if (touched[field]) {
      if (field === "name") {
        const err = validateName(sanitizeName(value));
        setErrors((prev) => ({ ...prev, name: err }));
      }
      if (field === "description") {
        const err = validateDescription(value);
        setErrors((prev) => ({ ...prev, description: err }));
      }
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "name") {
      const err = validateName(sanitizeName(form.name));
      setErrors((prev) => ({ ...prev, name: err }));
    }
    if (field === "description") {
      const err = validateDescription(form.description);
      setErrors((prev) => ({ ...prev, description: err }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nameErr = validateName(sanitizeName(form.name));
    const descErr = validateDescription(form.description);
    const allErrors = { name: nameErr, description: descErr };
    setErrors(allErrors);
    setTouched({ name: true, description: true });

    if (nameErr || descErr) return;

    onSubmit({
      name: sanitizeName(form.name),
      description: sanitizeDescription(form.description),
      status: form.status,
      parentId: form.parentId || null,
    });
  }

  // Categorías disponibles como padre (excluir la categoría actual en edición y subcategorías)
  const availableParents = parentCategories.filter(
    (c) => !initialData || c.id !== initialData.id
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre */}
      <div>
        <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700">
          Nombre <span className="text-danger">*</span>
        </label>
        <input
          id="cat-name"
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
            errors.name
              ? "border-red-300 focus:border-red-400 focus:ring-red/20"
              : "border-gray-200 focus:border-primary focus:ring-primary/20"
          }`}
          placeholder="Ej: Accesorios"
          autoFocus
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="cat-desc" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="cat-desc"
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          onBlur={() => handleBlur("description")}
          className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 resize-none ${
            errors.description
              ? "border-red-300 focus:border-red-400 focus:ring-red/20"
              : "border-gray-200 focus:border-primary focus:ring-primary/20"
          }`}
          placeholder="Descripción opcional"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
        {form.description && (
          <p className="mt-1 text-right text-xs text-gray-400">
            {form.description.length}/200
          </p>
        )}
      </div>

      {/* Categoría padre (subcategoría de...) */}
      {availableParents.length > 0 && (
        <div>
          <label htmlFor="cat-parent" className="block text-sm font-medium text-gray-700">
            ¿Es subcategoría de...?{" "}
            <span className="font-normal text-gray-400">(opcional)</span>
          </label>
          <select
            id="cat-parent"
            value={form.parentId}
            onChange={(e) => handleChange("parentId", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">— Categoría principal —</option>
            {availableParents.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {form.parentId && (
            <p className="mt-1 text-xs text-primary">
              Esta categoría se mostrará como subcategoría de "{availableParents.find(c => c.id === form.parentId)?.name}".
            </p>
          )}
        </div>
      )}

      {/* Estado */}
      <div>
        <label htmlFor="cat-status" className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="cat-status"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-800 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="active">Activa</option>
          <option value="inactive">Inactiva</option>
        </select>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {loading
            ? "Guardando..."
            : initialData
            ? "Guardar cambios"
            : "Crear categoría"}
        </button>
      </div>
    </form>
  );
}
