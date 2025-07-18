import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecipeHeader, ComponentList, AddComponentForm, CostCalculator } from "../../components/RecipeDetails";
import { uploadImage } from "../../lib/uploadImage";
import { authFetch } from "../../lib/api";
import { API_BASE_URL } from "../../lib/config";
import type { RecipeData, MaterialCost, Material, RecipeRef } from "../../components/RecipeDetails";
import { toast } from "react-toastify";
import { deleteRecipeLocalFirst, updateRecipeLocalFirst  } from "../../lib/api";


export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipes, setRecipes] = useState<RecipeRef[]>([]);

  const [costQty, setCostQty] = useState("1");
  const [materialCosts, setMaterialCosts] = useState<MaterialCost[]>([]);
  const [totalCost, setTotalCost] = useState<number | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedYield, setEditedYield] = useState("");
  const [editedProcedure, setEditedProcedure] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchRecipe = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
      if (res.status === 404) {
        setRecipe(null);
        return;
      }
      const data = await res.json();
      setRecipe(data);
    } catch (err: any) {
      setError("Error al recargar la receta: " + err.message);
    }
  };

  const handleDelete = async () => {
  const confirmed = window.confirm("¿Estás seguro de que querés eliminar esta receta?");
  if (!confirmed || !id) return;

  try {
    await toast.promise(
      deleteRecipeLocalFirst(Number(id)),
      {
        pending: "Eliminando localmente...",
        success: "🗑️ Receta eliminada (se sincronizará en segundo plano)",
        error: "❌ Error al eliminar localmente",
      }
    );
    navigate("/recipes", { replace: true });
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mRes, rRes, dRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/materials?all=true`),
          fetch(`${API_BASE_URL}/api/recipes?all=true`),
          fetch(`${API_BASE_URL}/api/recipes/${id}`)
        ]);
        const [mData, rData, dData] = await Promise.all([mRes.json(), rRes.json(), dRes.json()]);
        setMaterials(mData);
        setRecipes(rData);
        setRecipe(dData);
        setEditedName(dData.name);
        setEditedYield(dData.yield.toString());
        setEditedProcedure(dData.procedure);
        setEditedImageUrl(dData.image_url || "");
      } catch (err: any) {
        setError("Error al cargar los datos: " + err.message);
      }
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  useEffect(() => {
    const fetchCost = async () => {
      if (!id || isNaN(Number(costQty))) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/recipes/${id}/cost?qty=${costQty}`);
        const data = await res.json();
        if (!data.error) {
          setMaterialCosts(data.materials);
          setTotalCost(data.total_cost);
        }
      } catch {}
    };
    fetchCost();
  }, [id, costQty]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditedImageUrl(url);
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6">
      {loading && <p className="text-center text-pink-600">Cargando...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && recipe && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6">
          {editMode ? (
            <>
              <input
                className="w-full border rounded px-3 py-1 mb-2"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <input
                type="number"
                className="w-full border rounded px-3 py-1 mb-2"
                value={editedYield}
                onChange={(e) => setEditedYield(e.target.value)}
              />
              <textarea
                className="w-full border rounded px-3 py-1 mb-2"
                rows={4}
                value={editedProcedure}
                onChange={(e) => setEditedProcedure(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mb-2"
              />
              {editedImageUrl && (
                <img src={editedImageUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-4" />
              )}
            </>
          ) : (
            <RecipeHeader recipe={recipe} />
          )}

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="text-sm text-blue-500 underline mb-6"
            >
              Editar receta
            </button>
          ) : (
            <div className="flex gap-4 mb-6">
              <button
                onClick={async () => {
  if (!recipe) return;

  const updated = {
    ...recipe,
    name: editedName,
    yield: Number(editedYield),
    procedure: editedProcedure,
    image_url: editedImageUrl,
  };

  try {
    await toast.promise(
      updateRecipeLocalFirst(updated),
      {
        pending: "Guardando cambios...",
        success: "✅ Cambios guardados localmente",
        error: "❌ Error al guardar",
      }
    );
    setRecipe(updated);
    setEditMode(false);
  } catch (err) {
    console.error(err);
    alert("Error al guardar los cambios");
  }
}}


                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setEditedName(recipe.name);
                  setEditedYield(recipe.yield.toString());
                  setEditedProcedure(recipe.procedure);
                  setEditedImageUrl(recipe.image_url || "");
                }}
                className="text-gray-500 underline"
              >
                Cancelar
              </button>
            </div>
          )}

          <ComponentList recipeId={recipe.id} components={recipe.components} onChange={fetchRecipe} />
          <AddComponentForm recipeId={recipe.id} materials={materials} recipes={recipes} onChange={fetchRecipe} />
          <CostCalculator
            recipeId={recipe.id}
            costQty={costQty}
            setCostQty={setCostQty}
            materialCosts={materialCosts}
            totalCost={totalCost}
          />
          <div className="mt-6 text-center">
            <button onClick={() => navigate(-1)} className="text-pink-600 hover:underline font-medium">
              ← Volver
            </button>
            <button
              onClick={handleDelete}
              className="w-full mt-4 bg-red-100 text-red-600 border border-red-300 rounded-xl px-4 py-2 hover:bg-red-200 font-semibold text-sm"
            > 
              Eliminar receta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}