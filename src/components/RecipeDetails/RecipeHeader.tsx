import React from "react";
import type { RecipeData } from "./types";

export default function RecipeHeader({ recipe }: { recipe: RecipeData }) {
  return (
    <>
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}
      <h1 className="text-2xl font-bold text-pink-700 mb-2">{recipe.name}</h1>
      <p className="text-sm text-pink-500 mb-4">Rinde: {recipe.yield}</p>
      <h2 className="text-lg font-semibold mb-2">Procedimiento</h2>
      <p className="text-sm mb-4 whitespace-pre-wrap">{recipe.procedure}</p>
    </>
  );
}