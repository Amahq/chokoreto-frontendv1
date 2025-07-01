import { db } from "./db";
import { API_BASE_URL } from "./config";
import { trySyncPendingMutations } from "./sync";

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
