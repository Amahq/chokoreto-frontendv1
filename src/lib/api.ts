import { db } from "./db";
import type { RecipeData } from "../components/RecipeDetails/types";

/**
 * Actualiza una receta localmente y encola la actualización para sincronización.
 */
export async function updateRecipeLocalFirst(recipe: RecipeData): Promise<void> {
  // Guardar edición local
  await db.recipes.put(recipe);

  // Buscar si ya está sincronizada para incluir el ID real
  const synced = await db.syncedIds
    ?.where({ localId: recipe.id, type: "recipes" })
    .first();

  const payload = {
    ...recipe,
    id: synced?.remoteId ?? recipe.id,
    wasSynced: Boolean(synced),
  };

  await db.pendingMutations.add({
    type: "update",
    target: "recipes",
    payload,
    createdAt: new Date().toISOString(),
  });
}
