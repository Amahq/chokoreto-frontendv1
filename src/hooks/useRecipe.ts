import { useEffect, useState } from "react";
import type { Recipe } from "../entities/recipe/RecipeModel";
import { recipeRepo } from "../entities/recipe"; // el repositorio ya compuesto

export function useRecipe(id?: number) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const data = await recipeRepo.get(id);
        if (!data) {
          setError("Receta no encontrada");
          setRecipe(null);
        } else {
          setRecipe(data);
        }
      } catch (err) {
        console.error("❌ Error al cargar receta:", err);
        setError("Error de carga");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  return { recipe, loading, error };
}
