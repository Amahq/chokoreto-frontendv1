import { db } from "./db";
import { API_BASE_URL } from "./config";
import type { Material } from "../components/RecipeDetails/types";
import type { RecipeData } from "../components/RecipeDetails/types";
import type { Price } from "./db";
import { hasPendingMutations } from "./utils";

export async function preloadAppData() {
  const shouldSkip = await hasPendingMutations();
  if (shouldSkip) {
    console.log("⏭️ Precarga omitida: hay mutaciones pendientes");
    return;
  }

  console.log("🔄 Precargando datos...");

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

    const validPrices: Price[] = prices
      .filter(
        (p) =>
          typeof p.material_id === "number" &&
          typeof p.date === "string" &&
          typeof p.price === "number"
      )
      .map((p) => ({
        materialId: p.material_id,
        date: p.date,
        price: p.price,
      }));

    console.log("Ejemplo de precio válido:", validPrices[0]);

    await db.transaction("rw", db.materials, db.recipes, db.prices, async () => {
      await db.materials.clear();
      await db.recipes.clear();
      await db.prices.clear();
      await db.materials.bulkPut(materials);
      await db.recipes.bulkPut(recipes);
      await db.prices.bulkPut(validPrices);
    });

    console.log("✅ Precarga completada con éxito");

  } catch (err) {
    console.error("❌ Error al precargar datos:", err);
  }
}
