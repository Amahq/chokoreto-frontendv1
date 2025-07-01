import { useEffect, useState } from "react";
import { db } from "../lib/db";
import type { RecipeComponent } from "../components/RecipeDetails/types";

interface MaterialCost {
  name: string;
  cost: number;
}

export function useRecipeComponentCosts(components: RecipeComponent[], qty: number) {
  const [materialCosts, setMaterialCosts] = useState<MaterialCost[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const calculate = async () => {
      console.log("🧮 Calculando costo con qty:", qty);
      console.log("📦 Componentes:", components);

      setLoading(true);
      let total = 0;
      const costs: MaterialCost[] = [];

      for (const c of components) {
  if (c.type !== "material" || !c.material) {
    console.warn("⚠️ Componente sin material:", c);
    continue;
  }

  const prices = await db.prices
    .where("materialId")
    .equals(c.material.id)
    .toArray();

  const latest = prices
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  if (!latest) {
    console.warn(`⚠️ No hay precios para ${c.material.name}`);
    continue;
  }

  const cost = latest.price * c.amount * qty;
  total += cost;
  costs.push({ name: c.material.name, cost });
}


      if (!cancelled) {
        setMaterialCosts(costs);
        setTotalCost(total);
        setLoading(false);
      }
    };

    if (qty > 0 && components.length > 0) {
      calculate();
    } else {
      setMaterialCosts([]);
      setTotalCost(0);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [components, qty]);

  return { materialCosts, totalCost, loading };
}
