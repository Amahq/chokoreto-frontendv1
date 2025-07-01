import { useState } from "react";
import { useMaterials } from "../hooks/useMaterials";
import {
  createMaterialLocalFirst,
  updateMaterialLocalFirst,
  deleteMaterialLocalFirst
} from "../lib/api";
import { toast } from "react-toastify";

export default function Materials() {
  const { materials, loading, refetch } = useMaterials();
  const [localMaterials, setLocalMaterials] = useState(materials);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");

  // Sincronizar cuando cargan
  if (localMaterials !== materials) setLocalMaterials(materials);

  const handleAdd = async () => {
    if (!newName || !newUnit) return;
    try {
      const newMaterial = { id: Date.now(), name: newName, unit: newUnit };

      await toast.promise(
        createMaterialLocalFirst(newMaterial),
        {
          pending: "Agregando material...",
          success: "✅ Guardado localmente",
          error: "❌ Error al agregar",
        }
      );

      setNewName("");
      setNewUnit("");
      await refetch(); // <- Actualiza desde IndexedDB
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (mat) => {
    try {
      await toast.promise(
        updateMaterialLocalFirst(mat),
        {
          pending: "Guardando...",
          success: "✅ Guardado localmente",
          error: "❌ Error al guardar",
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este material?")) return;
    try {
      await toast.promise(
        deleteMaterialLocalFirst(id),
        {
          pending: "Eliminando...",
          success: "✅ Eliminado localmente",
          error: "❌ Error al eliminar",
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Materiales</h1>

      {loading ? (
        <p className="text-pink-600">Cargando...</p>
      ) : (
        <table className="w-full mb-6 border border-pink-200 text-sm">
          <thead className="bg-pink-100">
            <tr>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Unidad</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {localMaterials.map((mat) => (
              <tr key={mat.id} className="border-t">
                <td className="p-2">
                  <input
                    value={mat.name}
                    onChange={(e) =>
                      setLocalMaterials((prev) =>
                        prev.map((m) => (m.id === mat.id ? { ...m, name: e.target.value } : m))
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={mat.unit}
                    onChange={(e) =>
                      setLocalMaterials((prev) =>
                        prev.map((m) => (m.id === mat.id ? { ...m, unit: e.target.value } : m))
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleUpdate(mat)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => handleDelete(mat.id)}
                    className="text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="bg-white p-4 rounded-xl shadow max-w-md mx-auto">
        <h2 className="font-semibold text-lg mb-2">Agregar nuevo material</h2>
        <input
          placeholder="Nombre"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-2"
        />
        <input
          placeholder="Unidad (ej: gramos)"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-3"
        />
        <button
          onClick={handleAdd}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-4 py-2 font-semibold"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
