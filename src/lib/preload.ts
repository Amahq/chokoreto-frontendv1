import { db } from "./db";
import { API_BASE_URL } from "./config";
import type { Material } from "../components/RecipeDetails/types";
import type { RecipeData } from "../components/RecipeDetails/types";
import type { Price } from "./db";

export async function preloadAppData() {
  console.log("Precargando datos...");

  try {
    const [materialsRes, recipesRes, pricesRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/materials?all=true`),
      fetch(`${API_BASE_URL}/api/recipes?all=true`),
      fetch(`${API_BASE_URL}/api/prices?all=true`),
    ]);

    if (!materialsRes.ok)
      throw new Error(`❌ Falló fetch de materiales: ${materialsRes.status}`);
    if (!recipesRes.ok)
      throw new Error(`❌ Falló fetch de recetas: ${recipesRes.status}`);
    if (!pricesRes.ok)
      throw new Error(`❌ Falló fetch de precios: ${pricesRes.status}`);

    const [materials, recipes, prices] = await Promise.all([
      materialsRes.json(),
      recipesRes.json(),
      pricesRes.json(),
    ]);

    // Asegurar ID válido en precios
    const enrichedPrices: Price[] = prices.map((p, idx) => ({
      id: p.id ?? `${p.materialId}-${p.date ?? idx}`,
      ...p,
    }));

    await db.transaction("rw", db.materials, db.recipes, db.prices, async () => {
      await db.materials.clear();
      await db.recipes.clear();
      await db.prices.clear();
      await db.materials.bulkPut(materials);
      await db.recipes.bulkPut(recipes);
      await db.prices.bulkPut(enrichedPrices);
    });

    console.log("✅ Precarga completada con éxito");
  } catch (err) {
    console.error("❌ Error al precargar datos:", err);
  }
}
