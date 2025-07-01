import { useEffect, useState } from "react";
import { db } from "../lib/db";
import type { Material } from "../components/RecipeDetails/types";
import type { Price } from "../lib/db";
import { toast } from "react-toastify";

export default function Prices() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [newMaterialId, setNewMaterialId] = useState("");
  const [newPrice, setNewPrice] = useState("");

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

    const entry = {
      materialId,
      price: priceValue,
      date: new Date().toISOString(),
    };

    try {
      await db.prices.put(entry);
      await db.pendingMutations.add({
        type: "create",
        target: "prices",
        payload: entry,
        createdAt: new Date().toISOString(),
      });
      toast.success("✅ Precio agregado localmente");
      setPrices((prev) => [...prev, entry]);
      setNewPrice("");
    } catch (err) {
      console.error("❌ Error al guardar precio:", err);
      toast.error("❌ Error al guardar");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Precios</h1>

      <table className="w-full text-sm border border-pink-200 mb-8">
        <thead className="bg-pink-100">
          <tr>
            <th className="text-left p-2">Material</th>
            <th className="text-left p-2">Fecha</th>
            <th className="text-left p-2">Precio</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, idx) => {
            const material = materials.find((m) => m.id === price.materialId);
            return (
              <tr key={idx} className="border-t">
                <td className="p-2">{material ? material.name : "🧩 Desconocido"}</td>
                <td className="p-2">{new Date(price.date).toLocaleString()}</td>
                <td className="p-2">${price.price.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="bg-white p-4 rounded-xl shadow max-w-md mx-auto">
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
