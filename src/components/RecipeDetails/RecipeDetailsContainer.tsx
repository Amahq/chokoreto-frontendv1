import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRecipe } from "../hooks/useRecipe";
import { API_BASE_URL } from "../lib/config";
import type { Material, RecipeRef } from "../components/RecipeDetails/types";
import RecipeDetails from "./RecipeDetails";

export default function RecipeDetailsContainer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { recipe, loading, error } = useRecipe(id ? Number(id) : undefined);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipes, setRecipes] = useState<RecipeRef[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mRes, rRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/materials?all=true`),
          fetch(`${API_BASE_URL}/api/recipes?all=true`),
        ]);
        const [mData, rData] = await Promise.all([mRes.json(), rRes.json()]);
        setMaterials(mData);
        setRecipes(rData);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) return <p className="text-center text-pink-600">Cargando...</p>;
  if (error || !recipe)
    return <p className="text-center text-red-600">{error || "Receta no encontrada"}</p>;

  return (
    <RecipeDetails
      recipe={recipe}
      materials={materials}
      recipes={recipes}
      navigate={navigate}
    />
  );
}
