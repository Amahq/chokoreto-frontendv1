import { db } from "./db";
import { API_BASE_URL } from "./config";
import { preloadAppData } from "./preload";
import { hasPendingMutations } from "./utils";

type Mutation = {
  id?: number;
  type: "create" | "update" | "delete";
  target: "recipes" | "materials" | "prices" | "components";
  payload: any;
  createdAt: string;
};

export async function trySyncPendingMutations() {
  const pending = await db.pendingMutations.toArray();

  for (const mutation of pending) {
    try {
      const { id: mutationId, type, target, payload } = mutation;
      if (!mutationId) continue;

      const token = localStorage.getItem("token") || "";
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };

      // --- COMPONENTS ---
      if (target === "components") {
        const { recipeId, component_id, component_type, quantity } = payload;

        if (type === "create") {
          const res = await fetch(`${API_BASE_URL}/api/components/${recipeId}/components`, {
            method: "POST",
            headers,
            body: JSON.stringify({ component_type, component_id, quantity }),
          });
          if (!res.ok) throw new Error("❌ Falló creación de componente");
        }

        if (type === "update") {
          const res = await fetch(`${API_BASE_URL}/api/components/${recipeId}/components/${component_id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ quantity }),
          });
          if (!res.ok) throw new Error("❌ Falló actualización de componente");
        }

        if (type === "delete") {
          const res = await fetch(`${API_BASE_URL}/api/components/${recipeId}/components/${component_id}`, {
            method: "DELETE",
            headers,
          });
          if (!res.ok) throw new Error("❌ Falló eliminación de componente");
        }

        await db.pendingMutations.delete(mutationId);
        continue;
      }

      // --- RECIPES ---
      if (type === "create" && target === "recipes") {
        const res = await fetch(`${API_BASE_URL}/api/recipes`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("❌ Falló creación de receta");

        const result = await res.json();
        await db.syncedIds.put({
          localId: payload.id,
          remoteId: result.id,
          type: "recipes",
        });
        await db.pendingMutations.delete(mutationId);
        continue;
      }

      if (type === "update" && target === "recipes") {
        const res = await fetch(`${API_BASE_URL}/api/recipes/${payload.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("❌ Falló actualización de receta");

        await db.pendingMutations.delete(mutationId);
        continue;
      }

      if (type === "delete" && target === "recipes") {
        const remoteId = payload.wasSynced ? payload.id : null;
        if (remoteId) {
          const res = await fetch(`${API_BASE_URL}/api/recipes/${remoteId}`, {
            method: "DELETE",
            headers,
          });
          if (!res.ok) throw new Error("❌ Falló eliminación remota de receta");
        }
        await db.pendingMutations.delete(mutationId);
        continue;
      }

      // --- MATERIALS ---
      if (type === "create" && target === "materials") {
        const res = await fetch(`${API_BASE_URL}/api/materials`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("❌ Falló creación de material");

        await db.pendingMutations.delete(mutationId);
        continue;
      }

      if (type === "update" && target === "materials") {
        const res = await fetch(`${API_BASE_URL}/api/materials/${payload.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("❌ Falló actualización de material");

        await db.pendingMutations.delete(mutationId);
        continue;
      }

      if (type === "delete" && target === "materials") {
        const res = await fetch(`${API_BASE_URL}/api/materials/${payload.id}`, {
          method: "DELETE",
          headers,
        });
        if (!res.ok) throw new Error("❌ Falló eliminación de material");

        await db.pendingMutations.delete(mutationId);
        continue;
      }

      // --- PRICES ---
      if (type === "create" && target === "prices") {
        const res = await fetch(`${API_BASE_URL}/api/prices`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("❌ Falló creación de precio");

        await db.pendingMutations.delete(mutationId);
        continue;
      }

    } catch (err) {
      console.error("❌ Error sincronizando mutación:", mutation, err);
    }
  }

  // Si ya no hay mutaciones pendientes, actualizamos desde backend
  const stillPending = await hasPendingMutations();
  if (!stillPending) {
    console.log("✅ Todas las mutaciones sincronizadas, refrescando datos...");
    await preloadAppData();
  }
}
