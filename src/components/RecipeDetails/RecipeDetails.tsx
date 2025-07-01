import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RecipeHeader,
  ComponentList,
  AddComponentForm,
  CostCalculator,
} from "../../components/RecipeDetails";
import { uploadImage } from "../../lib/uploadImage";
import { authFetch, deleteRecipeLocalFirst, updateRecipeLocalFirst } from "../../lib/api";
import { API_BASE_URL } from "../../lib/config";
import type {
  RecipeData,
  MaterialCost,
  Material,
  RecipeRef,
} from "../../components/RecipeDetails";
import { toast } from "react-toastify";
import { useRecipe } from "../../hooks/useRecipe";
import RecipeEditForm from "../../components/RecipeDetails/RecipeEditForm";
import RecipeMetaPanel from "../../components/RecipeDetails/RecipeMetaPanel";



export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { recipe, loading, error } = useRecipe(id ? Number(id) : undefined);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipes, setRecipes] = useState<RecipeRef[]>([]);

  const [costQty, setCostQty] = useState("1");

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedYield, setEditedYield] = useState("");
  const [editedProcedure, setEditedProcedure] = useState("");
  const [editedImageUrl, setEditedImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("¿Estás seguro de que querés eliminar esta receta?");
    if (!confirmed || !id) return;

    try {
      await toast.promise(deleteRecipeLocalFirst(Number(id)), {
        pending: "Eliminando localmente...",
        success: "🗑️ Receta eliminada (se sincronizará en segundo plano)",
        error: "❌ Error al eliminar localmente",
      });
      navigate("/recipes", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

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
      } catch (err: any) {
        console.error("Error al cargar los datos: " + err.message);
      }
    };
    fetchAll();
  }, [id]);

  useEffect(() => {
    if (recipe) {
      setEditedName(recipe.name);
      setEditedYield(recipe.yield.toString());
      setEditedProcedure(recipe.procedure);
      setEditedImageUrl(recipe.image_url || "");
    }
  }, [recipe]);

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
          <RecipeEditForm
  editMode={editMode}
  uploading={uploading}
  recipe={recipe}
  editedName={editedName}
  editedYield={editedYield}
  editedProcedure={editedProcedure}
  editedImageUrl={editedImageUrl}
  onNameChange={setEditedName}
  onYieldChange={setEditedYield}
  onProcedureChange={setEditedProcedure}
  onImageChange={handleFileChange}
  onCancel={() => {
    setEditMode(false);
    setEditedName(recipe.name);
    setEditedYield(recipe.yield.toString());
    setEditedProcedure(recipe.procedure);
    setEditedImageUrl(recipe.image_url || "");
  }}
/>


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
          await toast.promise(updateRecipeLocalFirst(updated), {
            pending: "Guardando cambios...",
            success: "✅ Cambios guardados localmente",
            error: "❌ Error al guardar",
          });
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


          <ComponentList
            recipeId={recipe.id}
            components={recipe.components}
            onChange={() => window.location.reload()}
          />
          <AddComponentForm
            recipeId={recipe.id}
            materials={materials}
            recipes={recipes}
            onChange={() => window.location.reload()}
          />
          <CostCalculator
            recipeId={recipe.id}
            costQty={costQty}
            setCostQty={setCostQty}
            components={recipe.components}
          />
          <RecipeMetaPanel
  onBack={() => navigate(-1)}
  onDelete={handleDelete}
/>

        </div>
      )}
    </div>
  );
}

