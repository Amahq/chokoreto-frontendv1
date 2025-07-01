import { db } from "./db";
import { API_BASE_URL } from "./config";
import { authFetch } from "./api";
import type { PendingMutation, RecipeData } from "./db";

export async function trySyncPendingMutations() {
  const pending = await db.pendingMutations.toArray();

  for (const mutation of pending) {
    try {
      const { id, type, target, payload } = mutation;

      if (target === "recipes") {
        const endpoint = `${API_BASE_URL}/api/recipes${payload.id ? `/${payload.id}` : ""}`;
        const method =
          type === "create" ? "POST" :
          type === "update" ? "PUT" :
          type === "delete" ? "DELETE" : "GET";

        const body = type === "delete" ? undefined : JSON.stringify(payload);

        const res = await authFetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body,
        });

        if (!res.ok) throw new Error("Error del servidor");

        // Si fue exitoso, eliminar de la cola y marcar receta como limpia
        await db.pendingMutations.delete(id!);

        if (type !== "delete") {
          await db.recipes.put({ ...payload, isDirty: false });
        } else {
          await db.recipes.delete(payload.id);
        }
      }
    } catch (err) {
      console.warn("Error al sincronizar:", err);
      // no eliminar de la cola, se reintentará luego
    }
  }
}
