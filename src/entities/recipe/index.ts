import { RecipeRepository } from "./RecipeRepository";
import { RecipeQueue } from "./queue/RecipeQueue";
import { pullRecipes } from "./sync/pull";
import { pushRecipes } from "./sync/push";
import { Recipe } from "./RecipeModel";

// Ensamblar todo como una "entidad operativa"
export const recipeRepo = new RecipeRepository();
export const recipeQueue = new RecipeQueue();

export const recipeSync = {
  pull: pullRecipes,
  push: pushRecipes,
};

export type { Recipe };
