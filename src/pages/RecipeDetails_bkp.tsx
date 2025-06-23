import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

interface MaterialComponent {
  type: "material";
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

interface SubRecipeComponent {
  type: "recipe";
  id: number;
  name: string;
  quantity: number;
  yield: number;
  procedure: string;
  image_url?: string;
  components: Component[];
}

type Component = MaterialComponent | SubRecipeComponent;

interface RecipeData {
  id: number;
  name: string;
  yield: number;
  procedure: string;
  image_url?: string;
  components: Component[];
}

interface MaterialCost {
  name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  cost: number;
}

interface Material {
  id: number;
  name: string;
  unit: string;
}

interface RecipeRef {
  id: number;
  name: string;
  yield: number;
}

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [costQty, setCostQty] = useState("1");
  const [materialCosts, setMaterialCosts] = useState<MaterialCost[]>([]);
  const [totalCost, setTotalCost] = useState<number | null>(null);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipes, setRecipes] = useState<RecipeRef[]>([]);

  const [componentType, setComponentType] = useState("material");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<number | null>(null);
  const [componentQuantity, setComponentQuantity] = useState("1");

  const [showNewComponentForm, setShowNewComponentForm] = useState(false);
  const [newMaterialUnit, setNewMaterialUnit] = useState("");
  const [newRecipeYield, setNewRecipeYield] = useState("1");
  const [newRecipeProcedure, setNewRecipeProcedure] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialRes, recipeRes, recipeDetailRes] = await Promise.all([
          fetch("https://recipes-backend.alejandro-hernandez-00.workers.dev/api/materials?all=true"),
          fetch("https://recipes-backend.alejandro-hernandez-00.workers.dev/api/recipes?all=true"),
          fetch(`https://recipes-backend.alejandro-hernandez-00.workers.dev/api/recipes/${id}`)
        ]);

        const materialsData = await materialRes.json();
        const recipesData = await recipeRes.json();
        const recipeDetail = await recipeDetailRes.json();

        setMaterials(materialsData);
        setRecipes(recipesData);
        setRecipe(recipeDetail);
      } catch (err: any) {
        setError("Error al cargar los datos: " + err.message);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchCost = async () => {
      if (!id || isNaN(Number(costQty))) return;
      try {
        const res = await fetch(`https://recipes-backend.alejandro-hernandez-00.workers.dev/api/recipes/${id}/cost?qty=${costQty}`);
        const data = await res.json();
        if (!data.error) {
          setMaterialCosts(data.materials);
          setTotalCost(data.total_cost);
        }
      } catch {}
    };
    fetchCost();
  }, [id, costQty]);

  useEffect(() => {
    const list = componentType === "material" ? materials : recipes;
    const matches = list.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(matches);
    setShowNewComponentForm(searchTerm.length > 2 && matches.length === 0);
  }, [searchTerm, componentType, materials, recipes]);

  const handleCreateNewComponent = async () => {
    if (!searchTerm || !id) return;
    try {
      const url = componentType === "material"
        ? "https://recipes-backend.alejandro-hernandez-00.workers.dev/api/materials"
        : "https://recipes-backend.alejandro-hernandez-00.workers.dev/api/recipes";

      const body = componentType === "material"
        ? { name: searchTerm, unit: newMaterialUnit }
        : { name: searchTerm, procedure: newRecipeProcedure, yield: Number(newRecipeYield) };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.id) {
        setSelectedComponentId(data.id);
        setShowNewComponentForm(false);
        setFilteredOptions([]); // ocultar dropdown
        if (componentType === "material") setMaterials([...materials, { id: data.id, name: searchTerm, unit: newMaterialUnit }]);
        if (componentType === "recipe") setRecipes([...recipes, { id: data.id, name: searchTerm, yield: Number(newRecipeYield) }]);
      }
    } catch (err) {
      alert("Error al crear componente nuevo");
    }
  };

  const handleAddComponent = async () => {
    if (!selectedComponentId || !componentQuantity || !id) return;
    try {
      const res = await fetch(`https://recipes-backend.alejandro-hernandez-00.workers.dev/api/components/${id}/components`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component_type: componentType,
          component_id: selectedComponentId,
          quantity: Number(componentQuantity)
        })
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Error al agregar componente");
    }
  };

  const renderComponents = (components: Component[]) => {
    return components.map((comp, index) => {
      if (comp.type === "material") {
        return (
          <li key={`material-${index}`} className="mb-2">
            🧁 <strong>{comp.name}</strong>: {comp.quantity} {comp.unit}
          </li>
        );
      } else {
        return (
          <li key={`recipe-${index}`} className="mb-2">
            📦 <Link to={`/recipes/${comp.id}`} className="text-pink-600 hover:underline font-semibold">
              {comp.name}
            </Link> (x{comp.quantity})
            <ul className="ml-4 mt-1 list-disc text-sm text-pink-700">
              {renderComponents(comp.components)}
            </ul>
          </li>
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6">
      {loading && <p className="text-center text-pink-600">Cargando...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && recipe && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6">
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
          )}
          <h1 className="text-2xl font-bold text-pink-700 mb-2">{recipe.name}</h1>
          <p className="text-sm text-pink-500 mb-4">Rinde: {recipe.yield}</p>
          <h2 className="text-lg font-semibold mb-2">Procedimiento</h2>
          <p className="text-sm mb-4 whitespace-pre-wrap">{recipe.procedure}</p>

          <h2 className="text-lg font-semibold mb-2">Componentes</h2>
          <ul className="list-disc ml-4 text-pink-800 mb-6">
            {renderComponents(recipe.components)}
          </ul>

          <div className="border-t pt-4 mt-6">
            <h3 className="font-semibold mb-2">Agregar componente</h3>
            <div className="mb-2">
              <select
                className="border rounded px-2 py-1"
                value={componentType}
                onChange={(e) => {
                  setComponentType(e.target.value);
                  setSearchTerm("");
                  setSelectedComponentId(null);
                  setShowNewComponentForm(false);
                  setFilteredOptions([]); // ocultar dropdown
                }}
              >
                <option value="material">Material</option>
                <option value="recipe">Receta</option>
              </select>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedComponentId(null);
              }}
              placeholder="Buscar por nombre"
              className="border px-2 py-1 rounded w-full mb-1"
            />
            {searchTerm && filteredOptions.length > 0 && (
              <ul className="bg-white border rounded shadow max-h-40 overflow-y-auto mb-2">
                {filteredOptions.map((opt) => (
                  <li
                    key={opt.id}
                    className="px-3 py-1 hover:bg-pink-100 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(opt.name);
                      setSelectedComponentId(opt.id);
                      setShowNewComponentForm(false);
                      setFilteredOptions([]); // ⬅️ Oculta el dropdown al seleccionar
                    }}
                  >
                    {opt.name}
                  </li>
                ))}
              </ul>
            )}

            {showNewComponentForm && (
              <div className="bg-pink-50 border rounded p-3 mt-2">
                <p className="mb-2 font-medium text-pink-700">
                  Crear nuevo {componentType === "material" ? "material" : "receta"} llamado "{searchTerm}"
                </p>
                {componentType === "material" ? (
                  <input
                    type="text"
                    placeholder="Unidad (ej: gramos, ml)"
                    value={newMaterialUnit}
                    onChange={(e) => setNewMaterialUnit(e.target.value)}
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                ) : (
                  <>
                    <input
                      type="number"
                      placeholder="Rinde"
                      value={newRecipeYield}
                      onChange={(e) => setNewRecipeYield(e.target.value)}
                      className="border px-2 py-1 rounded w-full mb-2"
                    />
                    <textarea
                      placeholder="Procedimiento"
                      value={newRecipeProcedure}
                      onChange={(e) => setNewRecipeProcedure(e.target.value)}
                      className="border px-2 py-1 rounded w-full mb-2"
                      rows={3}
                    />
                  </>
                )}
                <button
                  onClick={handleCreateNewComponent}
                  className="bg-pink-400 text-white px-4 py-1 rounded hover:bg-pink-500"
                >
                  Crear y seleccionar
                </button>
              </div>
            )}
            <input
              type="number"
              value={componentQuantity}
              onChange={(e) => setComponentQuantity(e.target.value)}
              className="border px-2 py-1 rounded w-full mt-2"
              placeholder="Cantidad"
            />
            <button
              onClick={handleAddComponent}
              className="bg-pink-500 text-white px-4 py-2 rounded mt-3 hover:bg-pink-600"
            >
              Agregar a la receta
            </button>
          </div>

          <div className="border-t pt-4 mt-6">
            <h2 className="text-lg font-semibold mb-2">Costo total</h2>
            <div className="mb-2">
              <label className="text-sm text-pink-600 mr-2">Cantidad deseada:</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={costQty}
                onChange={(e) => setCostQty(e.target.value)}
                className="border border-pink-300 rounded px-2 py-1 text-sm w-24"
              />
            </div>

            {materialCosts.length > 0 && (
              <div className="text-sm text-pink-800 space-y-1 mt-2">
                {materialCosts.map((mat, idx) => (
                  <div key={idx} className="flex justify-between border-b border-pink-100 py-1">
                    <div>
                      {mat.name} ({mat.quantity.toFixed(2)} {mat.unit})
                    </div>
                    <div>${mat.cost.toFixed(2)}</div>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t border-pink-300 pt-2 mt-2">
                  <div>Total</div>
                  <div>${totalCost?.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-pink-600 hover:underline font-medium"
            >
              ← Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
