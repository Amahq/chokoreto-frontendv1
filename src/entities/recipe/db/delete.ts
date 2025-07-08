import { db } from "../../../lib/db";
import type { Recipe } from "../RecipeModel";

export async function deleteRecipe(id: number): Promise<void> {
  await db.recipes.delete(id);
}
