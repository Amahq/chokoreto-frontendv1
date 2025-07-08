import Dexie, { Table } from "dexie";
import type { Recipe } from "../entities/recipe/RecipeModel";
import type { Material } from "../entities/material/MaterialModel";
import type { Price } from "../entities/price/PriceModel";

// Tipo para mutaciones genéricas
export interface RawMutation {
  id?: string;
  type: "create" | "update" | "delete";
  target: string;
  payload: any;
  createdAt: string;
}

export interface SyncedId {
  localId: number | string;
  remoteId: number | string;
  type: string;
}

class ChokoretoDB extends Dexie {
  recipes!: Table<Recipe, number>;
  materials!: Table<Material, number>;
  prices!: Table<Price, number>;
  components!: Table<any, number>; // opcional
  pendingMutations!: Table<RawMutation, string>; // antes decía <..., number>
  syncedIds!: Table<SyncedId, [string, string]>; // [localId+type]

  constructor() {
    super("chokoreto");

    this.version(1).stores({
      recipes: "id, name",
      materials: "id, name",
      prices: "++id, materialId, date",
      components: "++id, recipeId, component_id",
      pendingMutations: "++id, type, target, createdAt",
      syncedIds: "[localId+type], localId, remoteId, type",
    });
  }
}

export const db = new ChokoretoDB();
