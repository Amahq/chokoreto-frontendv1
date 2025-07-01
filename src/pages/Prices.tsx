import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "../lib/db";
import { formatDate } from "../lib/utils";
import { AddPriceForm } from "../components/AddPriceForm";

export default function Prices() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const prices = useLiveQuery(async () => {
    const allPrices = await db.prices.orderBy("created_at").reverse().toArray();
    const latestMap = new Map<string, typeof allPrices[number]>();

    for (const price of allPrices) {
      if (!latestMap.has(price.material_id)) {
        latestMap.set(price.material_id, price);
      }
    }

    const latestPrices = Array.from(latestMap.values());

    if (search.trim()) {
      return latestPrices.filter((p) =>
        p.material_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return latestPrices;
  }, [search]);

  const priceHistory = useLiveQuery(() => db.prices.orderBy("created_at").reverse().toArray(), []);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4">
        <input
          type="text"
          placeholder="Buscar material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {prices?.map((price) => (
          <div
            key={price.id}
            className="border p-4 rounded-md bg-white shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{price.material_name}</div>
                <div className="text-sm text-gray-500">
                  Última actualización: {formatDate(price.created_at)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">${price.amount}</div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === price.material_id ? null : price.material_id)
                  }
                  className="text-blue-500 hover:underline text-sm mt-1"
                >
                  {expandedId === price.material_id ? "Ocultar historial" : "Ver historial ▸"}
                </button>
              </div>
            </div>

            {expandedId === price.material_id && (
              <div className="mt-4 border-t pt-2 space-y-2">
                {priceHistory
                  ?.filter((p) => p.material_id === price.material_id)
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>{formatDate(entry.created_at)}</span>
                      <span>${entry.amount}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white shadow-inner">
        <AddPriceForm />
      </div>
    </div>
  );
}
