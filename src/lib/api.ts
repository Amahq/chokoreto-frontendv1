import { db } from "./db";
import type { RecipeData } from "../components/RecipeDetails/types";

// ---------------------- RECETAS ----------------------

export async function createRecipeLocalFirst(recipe: RecipeData): Promise<number> {
  await db.recipes.put(recipe);

  const mutationId = crypto.randomUUID();
  await db.pendingMutations.add({
    id: mutationId,
    type: "create",
    target: "recipes",
    payload: recipe,
    createdAt: new Date().toISOString(),
  });

  return new Promise((resolve, reject) => {
    const timeoutMs = 10000;
    const start = Date.now();

    const check = async () => {
      const synced = await db.syncedIds
        ?.where({ localId: recipe.id, type: "recipes" })
        .first();

      if (synced) return resolve(synced.remoteId);

      if (Date.now() - start > timeoutMs) {
        return reject(new Error("⏱️ Timeout esperando ID del backend"));
      }

      setTimeout(check, 1000);
    };

    check();
  });
}

export async function updateRecipeLocalFirst(recipe: RecipeData): Promise<void> {
  await db.recipes.put(recipe);

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

export async function deleteRecipeLocalFirst(localId: number): Promise<void> {
  const synced = await db.syncedIds
    ?.where({ localId, type: "recipes" })
    .first();

  const payload = {
    id: synced?.remoteId ?? localId,
    wasSynced: Boolean(synced),
  };

  await db.recipes.delete(localId);

  await db.pendingMutations.add({
    type: "delete",
    target: "recipes",
    payload,
    createdAt: new Date().toISOString(),
  });
}

// ---------------------- MATERIALES ----------------------

export async function createMaterialLocalFirst(material: { id: number; name: string; unit: string }) {
  await db.materials.put(material);

  await db.pendingMutations.add({
    type: "create",
    target: "materials",
    payload: material,
    createdAt: new Date().toISOString(),
  });
}

export async function updateMaterialLocalFirst(material: { id: number; name: string; unit: string }) {
  await db.materials.put(material);

  await db.pendingMutations.add({
    type: "update",
    target: "materials",
    payload: material,
    createdAt: new Date().toISOString(),
  });
}

export async function deleteMaterialLocalFirst(materialId: number) {
  await db.materials.delete(materialId);

  await db.pendingMutations.add({
    type: "delete",
    target: "materials",
    payload: { id: materialId },
    createdAt: new Date().toISOString(),
  });
}

// ---------------------- COMPONENTES ----------------------

export async function addComponentLocalFirst(entry: {
  recipeId: number;
  component_type: "material" | "recipe";
  component_id: number;
  quantity: number;
}) {
  await db.pendingMutations.add({
    type: "create",
    target: "components",
    payload: entry,
    createdAt: new Date().toISOString(),
  });
}

export async function updateComponentLocalFirst(entry: {
  recipeId: number;
  component_id: number;
  quantity: number;
}) {
  await db.pendingMutations.add({
    type: "update",
    target: "components",
    payload: entry,
    createdAt: new Date().toISOString(),
  });
}

export async function deleteComponentLocalFirst(recipeId: number, componentId: number) {
  await db.pendingMutations.add({
    type: "delete",
    target: "components",
    payload: { recipeId, component_id: componentId },
    createdAt: new Date().toISOString(),
  });
}

// ---------------------- PRECIOS ----------------------

export async function addPriceLocalFirst(entry: {
  materialId: number;
  price: number;
  date: string;
}) {
  await db.prices.put(entry);

  await db.pendingMutations.add({
    type: "create",
    target: "prices",
    payload: entry,
    createdAt: new Date().toISOString(),
  });
}
