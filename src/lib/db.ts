import Dexie from "dexie";

export const db = new Dexie("chokoreto");

db.version(1).stores({
  recipes: "id, name",
  materials: "id, name",
  prices: "++id, materialId, date",
  components: "++id, recipeId, component_id", // ← opcional si querés persistirlos
  pendingMutations: "++id, type, target, createdAt",
  syncedIds: "[localId+type], localId, remoteId, type",
});


export type Price = {
  materialId: number;
  price: number;
  date: string;
};
