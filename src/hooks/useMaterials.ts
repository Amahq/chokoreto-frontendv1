import { useEffect, useState } from "react";
import { db } from "../lib/db";
import { API_BASE_URL } from "../lib/config";
import type { Material } from "../components/RecipeDetails/types";

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocal = async () => {
      const local = await db.materials.toArray();
      setMaterials(local);
      setLoading(false);
    };

    const syncRemote = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/materials?all=true`);
        if (!res.ok) return;

        const data: Material[] = await res.json();
        setMaterials(data);
        await db.materials.clear();
        await db.materials.bulkPut(data);
      } catch (err) {
        console.error("Error syncing materials:", err);
      }
    };

    loadLocal().then(syncRemote);
  }, []);

  return { materials, loading };
}
