import { useEffect, useState } from "react";
import { db } from "../lib/db";
import { API_BASE_URL } from "../lib/config";
import type { Price } from "../lib/db";

export function usePrices(materialId: number) {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLocalPrices = async () => {
    const local = await db.prices.where("materialId").equals(materialId).toArray();
    setPrices(local);
    setLoading(false);
  };

  const syncRemote = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/prices/${materialId}`);
      if (!res.ok) return;

      const data: Price[] = await res.json();
      // eliminamos todos los precios locales de ese material y los reemplazamos
      await db.prices.where("materialId").equals(materialId).delete();
      await db.prices.bulkPut(data);
      loadLocalPrices();
    } catch (err) {
      console.error("Error syncing prices:", err);
    }
  };

  useEffect(() => {
    if (!materialId) return;
    loadLocalPrices().then(syncRemote);
  }, [materialId]);

  return { prices, loading };
}
