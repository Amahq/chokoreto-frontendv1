import { useEffect, useState } from "react";
import { db } from "../lib/db";
import type { Material } from "../components/RecipeDetails/types";
import type { Price } from "../lib/db";

export default function Prices() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);

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
  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Precios</h1>

      <table className="w-full text-sm border border-pink-200">
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
    </div>
  );
}
