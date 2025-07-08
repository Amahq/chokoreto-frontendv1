import { API_BASE_URL } from "../../../lib/config";
import type { Recipe } from "../RecipeModel";
import { isValidRecipe } from "../RecipeModel";

export async function pullRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE_URL}/api/recipes?all=true`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token") || "",
    },
  });

  if (!res.ok) throw new Error("❌ Falló fetch de recetas");

  const data = await res.json();

  return (data as any[]).filter(isValidRecipe); // solo los válidos
}
