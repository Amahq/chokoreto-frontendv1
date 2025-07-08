import { useEffect, useState } from "react";
import type { Recipe } from "../entities/recipe/RecipeModel";
import { recipeRepo } from "../entities/recipe";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await recipeRepo.list();
        setRecipes(data);
      } catch (err) {
        console.error("❌ Error al cargar recetas:", err);
        setError("Error de carga");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { recipes, loading, error };
}
