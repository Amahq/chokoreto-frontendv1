import { useEffect, useState } from "react";

interface Material {
  id: number;
  name: string;
  unit: string;
}

export default function Materials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://recipes-backend.alejandro-hernandez-00.workers.dev/api/materials");
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error("Error al cargar materiales", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAdd = async () => {
    if (!newName || !newUnit) return;
    const res = await fetch("https://recipes-backend.alejandro-hernandez-00.workers.dev/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, unit: newUnit }),
    });
    if (res.ok) {
      setNewName("");
      setNewUnit("");
      fetchMaterials();
    }
  };

  const handleUpdate = async (mat: Material) => {
    await fetch(`https://recipes-backend.alejandro-hernandez-00.workers.dev/api/materials/${mat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: mat.name, unit: mat.unit }),
    });
    fetchMaterials();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este material?")) return;
    await fetch(`https://recipes-backend.alejandro-hernandez-00.workers.dev/api/materials/${id}`, {
      method: "DELETE",
    });
    fetchMaterials();
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
            {materials.map((mat, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">
                  <input
                    value={mat.name}
                    onChange={(e) =>
                      setMaterials((prev) =>
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
                      setMaterials((prev) =>
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