import { useState } from "react";
import { db } from "../../lib/db";
import { toast } from "react-toastify";
import type { RecipeComponent } from "./types";

interface Props {
  recipeId: number;
  components: RecipeComponent[];
  onChange: () => void;
}

export default function ComponentList({ recipeId, components, onChange }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedAmount, setEditedAmount] = useState("");

  const handleDelete = async (componentId: number) => {
    if (!confirm("¿Eliminar este componente?")) return;

    try {
      await db.pendingMutations.add({
        type: "delete",
        target: "components",
        payload: {
          recipeId,
          component_id: componentId,
        },
        createdAt: new Date().toISOString(),
      });

      toast.success("🗑️ Eliminado localmente");
      onChange();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al eliminar componente");
    }
  };

  const handleUpdate = async (component: RecipeComponent) => {
    const quantity = parseFloat(editedAmount);
    if (isNaN(quantity)) {
      alert("Cantidad inválida");
      return;
    }

    try {
      await db.pendingMutations.add({
        type: "update",
        target: "components",
        payload: {
          recipeId,
          component_id: component.id,
          quantity,
        },
        createdAt: new Date().toISOString(),
      });

      toast.success("✅ Modificado localmente");
      setEditingId(null);
      onChange();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al guardar componente");
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
                    onClick={() => handleUpdate(component)}
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
                    onClick={() => handleDelete(component.id)}
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
