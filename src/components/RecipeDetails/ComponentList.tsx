import { useState } from "react";
import { API_BASE_URL } from "../../lib/config";
import { authFetch } from "../../lib/api";
import { toast } from "react-toastify";
import type { RecipeComponent } from "./types";

interface Props {
  recipeId: number;
  components: RecipeComponent[];
  onChange: () => void;
}

export default function ComponentList({ recipeId, components, onChange }: Props) {
  console.warn("Componentes inválidos:", components.filter((c) => !c));

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedAmount, setEditedAmount] = useState("");

  const handleDelete = async (rowId: number) => {
    if (!confirm("¿Eliminar este componente?")) return;

    try {
      await toast.promise(
        authFetch(`${API_BASE_URL}/api/components/${recipeId}/components/${rowId}`, {
          method: "DELETE",
        }),
        {
          pending: "Eliminando...",
          success: "✅ Componente eliminado",
          error: "❌ Error al eliminar",
        }
      );
      onChange();
    } catch (err) {
      console.error(err);
    }
  };

const handleUpdate = async (rowId: number) => {
  const quantity = parseFloat(editedAmount);
  if (isNaN(quantity)) {
    alert("Cantidad inválida");
    return;
  }

  try {
    const res = await authFetch(`${API_BASE_URL}/api/components/${recipeId}/components/${rowId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      console.error("❌ Error al guardar componente", await res.text());
      toast.error("Error al guardar componente");
      return;
    }

    toast.success("✅ Componente actualizado");
    setEditingId(null);
    onChange();
  } catch (err) {
    console.error(err);
    toast.error("❌ Error inesperado al guardar");
  }
};


  return (
    <div className="mt-6">
      <h3 className="font-bold mb-2 text-pink-800">Componentes</h3>
      <ul className="space-y-2 text-sm">
        {components.filter(Boolean).map((component) => (
          <li
            key={component.row_id}
            className="bg-pink-100 rounded-xl px-4 py-2 flex items-center justify-between"
          >
            {editingId === component.row_id ? (
              <>
                <input
                  type="number"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  className="border rounded px-2 py-1 w-24"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(component.row_id)}
                    className="text-green-600 hover:underline text-xs"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:underline text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>
                  {component.name} ({component.unit}):{" "}
                  <strong>{component.quantity}</strong>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(component.row_id);
                      setEditedAmount(component.quantity.toString());
                    }}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(component.row_id)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
