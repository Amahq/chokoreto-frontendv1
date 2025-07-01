import { useRecipeComponentCosts } from "../../hooks/useRecipeComponentCosts";
import type { RecipeComponent } from "./types";

interface Props {
  recipeId: number;
  costQty: string;
  setCostQty: (v: string) => void;
  components?: RecipeComponent[]; // ⚠️ ahora es opcional
}

export default function CostCalculator({
  costQty,
  setCostQty,
  components = [], // ⚠️ valor por defecto si es undefined
}: Props) {
  const qty = parseFloat(costQty) || 1;

  const { materialCosts, totalCost, loading } = useRecipeComponentCosts(
    components,
    qty
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">
      <h2 className="text-lg font-semibold mb-2">Costo estimado</h2>

      <label className="block text-sm font-medium mb-1">
        Cantidad de producción:
      </label>
      <input
        type="number"
        value={costQty}
        onChange={(e) => setCostQty(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-3"
        min={1}
      />

      {loading ? (
        <p className="text-pink-500 text-sm mb-3">Calculando...</p>
      ) : (
        <>
          {materialCosts.length > 0 ? (
            <ul className="text-sm text-pink-800 mb-3 space-y-1">
              {materialCosts.map((m, i) => (
                <li key={i}>
                  {m.name}: ${m.cost.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-pink-500 text-sm mb-3">Sin materiales calculables</p>
          )}
          <div className="text-right font-bold text-pink-700">
            Total: ${totalCost.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}
