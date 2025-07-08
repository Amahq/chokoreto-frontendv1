import { db } from "../../../lib/db";
import type { Recipe } from "../RecipeModel";

export async function getRecipe(id: number): Promise<Recipe | null> {
  return (await db.recipes.get(id)) ?? null;
}
