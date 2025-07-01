import { db } from "./db";
import { API_BASE_URL } from "./config";
import { authFetch } from "./api";
import type { PendingMutation } from "./db";

export async function trySyncPendingMutations() {
  const pending = await db.pendingMutations.toArray();

  for (const mutation of pending) {
    try {
      const { id, type, target, payload } = mutation;

      if (target !== "recipes" && target !== "materials") continue;

      const method =
        type === "create" ? "POST" :
        type === "update" ? "PUT" :
        type === "delete" ? "DELETE" : "GET";

      const endpoint =
        type === "create"
          ? `${API_BASE_URL}/api/${target}`
          : `${API_BASE_URL}/api/${target}/${payload.id}`;

      const body = type === "delete" ? undefined : JSON.stringify(payload);

      const res = await authFetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) throw new Error("Error del servidor");

      await db.pendingMutations.delete(id!);

      if (type !== "delete") {
        await db[target].put({ ...payload, isDirty: false });
      } else {
        await db[target].delete(payload.id);
      }
    } catch (err) {
      console.warn("Error al sincronizar:", err);
    }
  }
}
