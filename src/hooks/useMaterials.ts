import { useEffect, useState } from "react";
import { db } from "../lib/db";
import { API_BASE_URL } from "../lib/config";
import type { Material } from "../components/RecipeDetails/types";
import { hasPendingMutations } from "../lib/utils";

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMaterials = async () => {
    const local = await db.materials.toArray();
    setMaterials(local);
    setLoading(false);
  };

  const syncRemote = async () => {
    const pending = await hasPendingMutations();
    if (pending) {
      console.log("⏭️ Saltando sincronización de materiales: hay mutaciones pendientes");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/materials?all=true`);
      if (!res.ok) return;

      const data: Material[] = await res.json();
      await db.materials.clear();
      await db.materials.bulkPut(data);
      loadMaterials(); // actualizar luego del sync
    } catch (err) {
      console.error("❌ Error sincronizando materiales:", err);
    }
  };

  useEffect(() => {
    loadMaterials().then(syncRemote);
  }, []);

  return { materials, loading, refetch: loadMaterials };
}
