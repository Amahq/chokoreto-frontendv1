import { useEffect, useState } from "react";
import { db } from "../lib/db";
import { API_BASE_URL } from "../lib/config";
import type { RecipeData } from "../components/RecipeDetails/types";

export function useRecipe(id: number | undefined) {
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadLocal = async () => {
      const local = await db.recipes.get(id);
      if (local) setRecipe(local);
    };

    const syncRemote = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
        if (res.status === 404) {
          setRecipe(null);
          setError("Receta no encontrada");
          return;
        }

        const data: RecipeData = await res.json();
        setRecipe(data);
        await db.recipes.put(data);
      } catch (err) {
        setError("Error al sincronizar receta");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLocal().then(syncRemote);
  }, [id]);

  return { recipe, loading, error };
}
