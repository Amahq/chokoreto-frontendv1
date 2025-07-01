import Dexie, { Table } from 'dexie';
import type { RecipeData, Material } from "../components/RecipeDetails/types";

export interface PendingMutation {
  id?: number;
  type: 'create' | 'update' | 'delete';
  target: 'recipes' | 'materials';
  payload: any;
  createdAt: string;
}

export interface Price {
  materialId: number;
  date: string; // formato ISO
  price: number;
}

class ChokoretoDB extends Dexie {
  recipes!: Table<RecipeData>;
  materials!: Table<Material>;
  pendingMutations!: Table<PendingMutation>;
  prices!: Table<Price>;

  constructor() {
    super('chokoreto');
    this.version(1).stores({
  recipes: 'id, updatedAt, isDirty',
  materials: 'id, updatedAt, isDirty',
  pendingMutations: '++id, target, type, createdAt',
  prices: '[materialId+date], materialId, date'
});

  }
}

export const db = new ChokoretoDB();
