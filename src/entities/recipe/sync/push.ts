import { API_BASE_URL } from "../../../lib/config";
import type { Recipe } from "../RecipeModel";

export async function pushRecipes(recipes: Recipe[]): Promise<void> {
  for (const recipe of recipes) {
    const res = await fetch(`${API_BASE_URL}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") || "",
      },
      body: JSON.stringify(recipe),
    });

    if (!res.ok) {
      console.error("❌ Falló subida de receta:", recipe);
      throw new Error("Falló sincronización de receta");
    }
  }
}
