import { db } from "./db";
import { API_BASE_URL } from "./config";
import { trySyncPendingMutations } from "./sync";
import type { Material } from "../components/RecipeDetails/types";

/**
 * Wrapper sobre fetch() que agrega automáticamente el token de autorización.
 */
export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const headers = {
    ...(init.headers || {}),
    Authorization: "Bearer SECRET_TOKEN_123",
  };

  return fetch(input, {
    ...init,
    headers,
  });
}

/**
 * Crear receta (modo Local First)
 */
export async function createRecipeLocalFirst(recipe: any) {
  await db.recipes.put({ ...recipe, isDirty: true });
  await db.pendingMutations.add({
    type: "create",
    target: "recipes",
    payload: recipe,
    createdAt: new Date().toISOString(),
  });
  trySyncPendingMutations();
}

/**
 * Actualizar receta (modo Local First)
 */
export async function updateRecipeLocalFirst(recipe: any) {
  await db.recipes.put({ ...recipe, isDirty: true });
  await db.pendingMutations.add({
    type: "update",
    target: "recipes",
    payload: recipe,
    createdAt: new Date().toISOString(),
  });
  trySyncPendingMutations();
}

/**
 * Eliminar receta (modo Local First)
 */
export async function deleteRecipeLocalFirst(id: number) {
  await db.recipes.delete(id);
  await db.pendingMutations.add({
    type: "delete",
    target: "recipes",
    payload: { id },
    createdAt: new Date().toISOString(),
  });
  trySyncPendingMutations();
}

/**
 * Crear material (modo Local First)
 */
export async function createMaterialLocalFirst(material: Material) {
  await db.materials.put({ ...material });
  await db.pendingMutations.add({
    type: "create",
    target: "materials",
    payload: material,
    createdAt: new Date().toISOString(),
  });
  trySyncPendingMutations();
}

/**
 * Actualizar material (modo Local First)
 */
export async function updateMaterialLocalFirst(material: Material) {
  await db.materials.put({ ...material });
  await db.pendingMutations.add({
    type: "update",
    target: "materials",
    payload: material,
    createdAt: new Date().toISOString(),
  });
  trySyncPendingMutations();
}

/**
 * Eliminar material (modo Local First)
 */
export async function deleteMaterialLocalFirst(id: number) {
  await db.materials.delete(id);
  await db.pendingMutations.add({
    type: "delete",
    target: "materials",
    payload: { id },
    createdAt: new Date().toISOString(),
  });
  trySyncPendingMutations();
}
