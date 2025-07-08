import { useEffect, useState } from "react";
import type { Price } from "../entities/price/PriceModel";
import { priceRepo } from "../entities/price";

export function usePrices(materialId: number) {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!materialId) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const all = await priceRepo.list();
        const filtered = all.filter((p) => p.materialId === materialId);
        setPrices(filtered);
      } catch (err) {
        console.error("❌ Error al cargar precios:", err);
        setError("Error de carga");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [materialId]);

  return { prices, loading, error };
}
