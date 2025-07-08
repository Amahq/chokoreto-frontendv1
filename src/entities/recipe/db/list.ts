import { db } from "../../../lib/db";
import type { Recipe } from "../RecipeModel";

export async function listRecipes(): Promise<Recipe[]> {
  return await db.recipes.toArray();
}
