import { db } from "../../lib/db"; // Tu instancia Dexie existente
import { IRepository } from "../../core/interfaces/IRepository";
import type { Recipe } from "./RecipeModel";

export class RecipeRepository implements IRepository<Recipe> {
  async get(id: number): Promise<Recipe | null> {
    return (await db.recipes.get(id)) ?? null;
  }

  async list(): Promise<Recipe[]> {
    return await db.recipes.toArray();
  }

  async create(recipe: Recipe): Promise<void> {
    await db.recipes.put(recipe);
  }

  async update(recipe: Recipe): Promise<void> {
    await db.recipes.put(recipe); // sobrescribe si ya existe
  }

  async delete(id: number): Promise<void> {
    await db.recipes.delete(id);
  }
}
