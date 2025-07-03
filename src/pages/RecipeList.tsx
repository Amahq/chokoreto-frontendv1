import { useEffect, useState } from "react";
import { Sparkles, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useRecipes } from "../hooks/useRecipes";
import type { RecipeData } from "../components/RecipeDetails/types";
import { hasPendingMutations } from "../lib/utils";

export default function RecipeList() {
  const { recipes, loading } = useRecipes();
  const [error, setError] = useState("");
  const [syncPending, setSyncPending] = useState(false);

  useEffect(() => {
    hasPendingMutations().then(setSyncPending);
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 font-sans px-4 py-6">
      <header className="flex items-center justify-center mb-6 relative">
        <img src="/capybara-mascot.png" alt="Capibara Chokoreto" className="w-14 h-14 mr-2" />
        <h1 className="text-3xl font-bold text-pink-600">Chokoreto</h1>
        {syncPending && (
          <div className="absolute right-4 top-0 flex items-center text-xs text-pink-500">
            <Clock className="w-4 h-4 mr-1" /> Cambios pendientes
          </div>
        )}
      </header>

      <h2 className="text-xl font-semibold text-center mb-4">Lista de recetas</h2>

      {loading && <p className="text-center text-pink-600">Cargando...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="grid gap-4 max-w-md mx-auto">
        {recipes.map((r: RecipeData) => (
          <Link
            to={`/recipes/${r.id}`}
            key={r.id}
            className="bg-white rounded-2xl shadow p-4 flex items-center space-x-4 hover:bg-pink-50 transition"
          >
            {r.image_url ? (
              <img
                src={r.image_url}
                alt={r.name}
                className="w-16 h-16 object-cover rounded-xl border border-pink-200"
              />
            ) : (
              <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center text-pink-400">
                <Sparkles className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-pink-700">{r.name}</h3>
              <p className="text-sm text-pink-500">Rinde: {r.yield}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
