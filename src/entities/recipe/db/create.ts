import { db } from "../../../lib/db";
import type { Recipe } from "../RecipeModel";

export async function createRecipe(recipe: Recipe): Promise<void> {
  await db.recipes.put(recipe);
}
