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
        const method =
          type === "create" ? "POST" :
          type === "update" ? "PUT" :
          type === "delete" ? "DELETE" : "GET";

        const endpoint =
          type === "create"
            ? `${API_BASE_URL}/api/recipes`
            : `${API_BASE_URL}/api/recipes/${payload.id}`;

        const body = type === "delete" ? undefined : JSON.stringify(payload);

        const res = await authFetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body,
        });

        if (!res.ok) throw new Error("Error del servidor");

        await db.pendingMutations.delete(id!);

        if (type !== "delete") {
          await db.recipes.put({ ...payload, isDirty: false });
        } else {
          await db.recipes.delete(payload.id);
        }

      } else if (target === "materials") {
        const method =
          type === "create" ? "POST" :
          type === "update" ? "PUT" :
          type === "delete" ? "DELETE" : "GET";

        const endpoint =
          type === "create"
            ? `${API_BASE_URL}/api/materials`
            : `${API_BASE_URL}/api/materials/${payload.id}`;

        const body = type === "delete" ? undefined : JSON.stringify(payload);

        const res = await authFetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body,
        });

        if (!res.ok) throw new Error("Error del servidor");

        await db.pendingMutations.delete(id!);

        if (type !== "delete") {
          await db.materials.put(payload);
        } else {
          await db.materials.delete(payload.id);
        }

      } else if (target === "prices") {
        const res = await authFetch(`${API_BASE_URL}/api/prices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Error al sincronizar precio");

        await db.pendingMutations.delete(id!);
        await db.prices.put(payload);
      }

    } catch (err) {
      console.warn("Error al sincronizar:", err);
    }
  }
}
