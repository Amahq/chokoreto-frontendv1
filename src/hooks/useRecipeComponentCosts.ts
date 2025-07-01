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
    const calculate = async () => {
      setLoading(true);
      let total = 0;
      const costs: MaterialCost[] = [];

      for (const c of components) {
        if (c.type !== "material") continue;

        const prices = await db.prices
          .where("materialId")
          .equals(c.material.id)
          .sortBy("date");

        const latest = prices.reverse()[0]; // más reciente

        if (latest) {
          const cost = latest.price * c.amount * qty;
          total += cost;
          costs.push({ name: c.material.name, cost });
        }
      }

      setMaterialCosts(costs);
      setTotalCost(total);
      setLoading(false);
    };

    if (qty > 0 && components.length > 0) calculate();
  }, [components, qty]);

  return { materialCosts, totalCost, loading };
}
