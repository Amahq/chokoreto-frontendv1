import React from "react";
import type { MaterialCost } from "./types";

interface Props {
  recipeId: number;
  costQty: string;
  setCostQty: (value: string) => void;
  materialCosts: MaterialCost[];
  totalCost: number | null;
}

export default function CostCalculator({
  costQty,
  setCostQty,
  materialCosts,
  totalCost
}: Props) {
  return (
    <div className="border-t pt-4 mt-6">
      <h2 className="text-lg font-semibold mb-2">Costo total</h2>
      <div className="mb-2">
        <label className="text-sm text-pink-600 mr-2">Cantidad deseada:</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={costQty}
          onChange={(e) => setCostQty(e.target.value)}
          className="border border-pink-300 rounded px-2 py-1 text-sm w-24"
        />
      </div>
      {materialCosts.length > 0 && (
        <div className="text-sm text-pink-800 space-y-1 mt-2">
          {materialCosts.map((mat, idx) => (
            <div key={idx} className="flex justify-between border-b border-pink-100 py-1">
              <div>{mat.name} ({mat.quantity.toFixed(2)} {mat.unit})</div>
              <div>${mat.cost.toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t border-pink-300 pt-2 mt-2">
            <div>Total</div>
            <div>${totalCost?.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
}