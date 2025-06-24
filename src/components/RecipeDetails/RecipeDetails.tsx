import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecipeHeader, ComponentList, AddComponentForm, CostCalculator } from "../../components/RecipeDetails";
import { uploadImage } from "../../lib/uploadImage";
import { authFetch } from "../../lib/api";
import { API_BASE_URL } from "../../lib/config";
import type { RecipeData, MaterialCost, Material, RecipeRef } from "../../components/RecipeDetails";
import { toast } from "react-toastify";

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
        authFetch(`${API_BASE_URL}/api/recipes/${id}`, {
          method: "DELETE",
        }),
        {
          pending: "Eliminando...",
          success: "🗑️ Receta eliminada",
          error: "❌ Error al eliminar la receta",
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
    // contenido del JSX no modificado
    <></>
  );
}