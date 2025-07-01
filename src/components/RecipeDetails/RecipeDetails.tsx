import { useState } from "react";
import {
  RecipeHeader,
  ComponentList,
  AddComponentForm,
  CostCalculator,
  RecipeMetaPanel,
} from "../../components/RecipeDetails";
import { uploadImage } from "../../lib/uploadImage";
import { updateRecipeLocalFirst, deleteRecipeLocalFirst } from "../../lib/api";
import RecipeEditForm from "../../components/RecipeDetails/RecipeEditForm";
import { toast } from "react-toastify";
import type {
  RecipeData,
  Material,
  RecipeRef,
} from "../../components/RecipeDetails/types";

interface Props {
  recipe: RecipeData;
  materials: Material[];
  recipes: RecipeRef[];
  navigate: (to: number | string, opts?: { replace?: boolean }) => void;
}

export default function RecipeDetails({ recipe, materials, recipes, navigate }: Props) {
  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-600">
        Cargando receta...
      </div>
    );
  }

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(recipe.name);
  const [editedYield, setEditedYield] = useState(recipe.yield.toString());
  const [editedProcedure, setEditedProcedure] = useState(recipe.procedure);
  const [editedImageUrl, setEditedImageUrl] = useState(recipe.image_url || "");
  const [uploading, setUploading] = useState(false);
  const [costQty, setCostQty] = useState("1");

  const handleDelete = async () => {
    const confirmed = window.confirm("¿Estás seguro de que querés eliminar esta receta?");
    if (!confirmed) return;

    try {
      await toast.promise(deleteRecipeLocalFirst(recipe.id), {
        pending: "Eliminando localmente...",
        success: "🗑️ Receta eliminada",
        error: "❌ Error al eliminar",
      });
      navigate("/recipes", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = async (file: File) => {
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
                    success: "✅ Cambios guardados",
                    error: "❌ Error al guardar",
                  });
                  setEditMode(false);
                } catch (err) {
                  console.error(err);
                  alert("Error al guardar");
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
          onDelete={handleDelete}
          onBack={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
