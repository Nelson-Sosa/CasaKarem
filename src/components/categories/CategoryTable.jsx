import { Fragment } from "react";
import { Pencil, EyeOff, Eye, Trash2, ChevronRight } from "lucide-react";
import CategoryStatusBadge from "./CategoryStatusBadge";

function CategoryRow({ cat, isChild = false, onEdit, onToggleStatus, onDelete }) {
  return (
    <tr className="transition-colors hover:bg-gray-50/50">
      <td className="px-5 py-4">
        <div className={`flex items-center gap-2 ${isChild ? "pl-6" : ""}`}>
          {isChild && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />}
          <p className={`font-medium ${isChild ? "text-gray-600 text-[13px]" : "text-gray-800"}`}>
            {cat.name}
          </p>
          {isChild && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
              sub
            </span>
          )}
        </div>
      </td>
      <td className="hidden px-5 py-4 sm:table-cell">
        <p className="truncate text-gray-500 max-w-xs text-sm">
          {cat.description || "—"}
        </p>
      </td>
      <td className="px-5 py-4">
        <CategoryStatusBadge status={cat.status} />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(cat)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-primary-light hover:text-primary"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToggleStatus(cat)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
            title={cat.status === "active" ? "Desactivar" : "Activar"}
          >
            {cat.status === "active" ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(cat)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function CategoryTable({ categories, onEdit, onToggleStatus, onDelete }) {
  // Separar padres e hijos
  const parents = categories.filter((c) => !c.parentId);
  const childrenMap = {};
  categories.filter((c) => c.parentId).forEach((c) => {
    if (!childrenMap[c.parentId]) childrenMap[c.parentId] = [];
    childrenMap[c.parentId].push(c);
  });

  // Categorías huérfanas (parentId apunta a un padre no visible en el filtro actual)
  const visibleIds = new Set(parents.map((p) => p.id));
  const orphans = categories.filter((c) => c.parentId && !visibleIds.has(c.parentId));

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-gray-50/50">
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Nombre
            </th>
            <th className="hidden px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:table-cell">
              Descripción
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Estado
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {parents.map((parent) => (
            <Fragment key={parent.id}>
              <CategoryRow
                cat={parent}
                isChild={false}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
              {(childrenMap[parent.id] || []).map((child) => (
                <CategoryRow
                  key={child.id}
                  cat={child}
                  isChild={true}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                />
              ))}
            </Fragment>
          ))}
          {orphans.map((cat) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              isChild={false}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
