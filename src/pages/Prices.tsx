import { useEffect, useState } from "react";

interface Material {
  id: number;
  name: string;
  unit: string;
}

interface Price {
  material_id: number;
  value: number;
  created_at: string;
}

export default function Prices() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [newPrices, setNewPrices] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [materialsRes, pricesRes] = await Promise.all([
        fetch("https://recipes-backend.alejandro-hernandez-00.workers.dev/api/materials"),
        fetch("https://recipes-backend.alejandro-hernandez-00.workers.dev/api/prices"),
      ]);
      const [materialsData, pricesData] = await Promise.all([materialsRes.json(), pricesRes.json()]);
      setMaterials(materialsData);
      setPrices(pricesData);
    } catch (err) {
      console.error("Error al cargar precios y materiales", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getLastPrice = (materialId: number): number | null => {
    const related = prices
      .filter((p) => p.material_id === materialId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return related.length ? related[0].value : null;
  };

  const handleUpdatePrice = async (materialId: number) => {
    const value = parseFloat(newPrices[materialId]);
    if (isNaN(value)) return;

    await fetch("https://recipes-backend.alejandro-hernandez-00.workers.dev/api/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ material_id: materialId, value }),
    });

    setNewPrices((prev) => ({ ...prev, [materialId]: "" }));
    fetchData();
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Precios de materiales</h1>

      {loading ? (
        <p className="text-pink-600">Cargando...</p>
      ) : (
        <table className="w-full mb-6 border border-pink-200 text-sm">
          <thead className="bg-pink-100">
            <tr>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Unidad</th>
              <th className="text-left p-2">Precio actual</th>
              <th className="text-left p-2">Nuevo precio</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr key={mat.id} className="border-t">
                <td className="p-2">{mat.name}</td>
                <td className="p-2">{mat.unit}</td>
                <td className="p-2">${getLastPrice(mat.id)?.toFixed(2) ?? "—"}</td>
                <td className="p-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPrices[mat.id] || ""}
                    onChange={(e) => setNewPrices((prev) => ({ ...prev, [mat.id]: e.target.value }))}
                    className="border rounded px-2 py-1 w-24"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleUpdatePrice(mat.id)}
                    className="text-blue-500 hover:underline"
                  >
                    Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}