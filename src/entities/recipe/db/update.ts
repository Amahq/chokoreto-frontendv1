import { db } from "../../../lib/db";
import type { Recipe } from "../RecipeModel";

export async function updateRecipe(recipe: Recipe): Promise<void> {
  await db.recipes.put(recipe);
}
