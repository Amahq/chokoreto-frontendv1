import { useEffect, useState } from "react";
import { db } from "../lib/db";
import { API_BASE_URL } from "../lib/config";
import type { RecipeData } from "../components/RecipeDetails/types";

export function useRecipes() {
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar recetas locales primero
  useEffect(() => {
    const loadLocal = async () => {
      const localRecipes = await db.recipes.toArray();
      setRecipes(localRecipes);
      setLoading(false);
    };

    const syncRemote = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/recipes`);
        if (!res.ok) return;

        const data: RecipeData[] = await res.json();
        setRecipes(data);
        await db.recipes.clear();
        await db.recipes.bulkPut(data);
      } catch (err) {
        console.error("Error syncing recipes:", err);
      }
    };

    loadLocal().then(syncRemote);
  }, []);

  return { recipes, loading };
}
