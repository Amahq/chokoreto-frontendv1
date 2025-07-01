import { useEffect, useState } from "react";
import { db } from "../lib/db";
import type { Material } from "../components/RecipeDetails/types";
import type { Price } from "../lib/db";
import { toast } from "react-toastify";
import { addPriceLocalFirst } from "../lib/api"; // ✅ usa wrapper limpio

export default function Prices() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [newMaterialId, setNewMaterialId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [expandedMaterialId, setExpandedMaterialId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const localMaterials = await db.materials.toArray();
      const localPrices = await db.prices.toArray();

      setMaterials(localMaterials);
      setPrices(localPrices);
    } catch (err) {
      console.error("❌ Error al cargar datos locales", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    const priceValue = parseFloat(newPrice);
    const materialId = parseInt(newMaterialId);
    if (!materialId || isNaN(priceValue)) return;

    try {
      // Guardar localmente solo en pendingMutations
      await addPriceLocalFirst({
        material_id: materialId,
        price: priceValue,
      });

      toast.success("✅ Precio encolado localmente");

      // Opcional: también actualizar estado para mostrarlo de inmediato
      setPrices((prev) => [
        ...prev,
        {
          materialId, // importante: en UI seguimos usando camelCase
          price: priceValue,
          date: new Date().toISOString(),
        },
      ]);
      setNewPrice("");
    } catch (err) {
      console.error("❌ Error al guardar precio:", err);
      toast.error("❌ Error al guardar");
    }
  };

  const latestPricesMap = prices
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce((acc, price) => {
      if (!acc[price.materialId]) {
        acc[price.materialId] = price;
      }
      return acc;
    }, {} as Record<number, Price>);

  const materialsWithLatestPrices = Object.entries(latestPricesMap).map(([materialId, price]) => ({
    materialId: parseInt(materialId),
    price,
    material: materials.find((m) => m.id === parseInt(materialId)),
  }));

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Precios actuales</h1>

      <div className="flex-1 overflow-y-auto space-y-4">
        {materialsWithLatestPrices.map(({ materialId, price, material }) => (
          <div key={materialId} className="border rounded-lg bg-white shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{material?.name || "🧩 Desconocido"}</div>
                <div className="text-sm text-gray-500">
                  Última actualización: {new Date(price.date).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">${price.price.toFixed(2)}</div>
                <button
                  className="text-pink-500 text-sm underline"
                  onClick={() =>
                    setExpandedMaterialId(expandedMaterialId === materialId ? null : materialId)
                  }
                >
                  {expandedMaterialId === materialId ? "Ocultar historial" : "Ver historial"}
                </button>
              </div>
            </div>

            {expandedMaterialId === materialId && (
              <div className="mt-3 border-t pt-2 space-y-1 text-sm text-gray-700">
                {prices
                  .filter((p) => p.materialId === materialId)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((p, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{new Date(p.date).toLocaleString()}</span>
                      <span>${p.price.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow max-w-md mx-auto mt-6">
        <h2 className="font-semibold text-lg mb-3">Agregar nuevo precio</h2>
        <select
          value={newMaterialId}
          onChange={(e) => setNewMaterialId(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-2"
        >
          <option value="">Seleccionar material</option>
          {materials.map((mat) => (
            <option key={mat.id} value={mat.id}>
              {mat.name} ({mat.unit})
            </option>
          ))}
        </select>
        <input
          placeholder="Precio"
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
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
