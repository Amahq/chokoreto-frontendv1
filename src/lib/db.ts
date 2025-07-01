import Dexie, { Table } from 'dexie';
import type { RecipeData, Material } from "../components/RecipeDetails/types";

export interface PendingMutation {
  id?: number;
  type: 'create' | 'update' | 'delete';
  target: 'recipes' | 'materials';
  payload: any;
  createdAt: string;
}

class ChokoretoDB extends Dexie {
  recipes!: Table<RecipeData>;
  materials!: Table<Material>;
  pendingMutations!: Table<PendingMutation>;

  constructor() {
    super('chokoreto');
    this.version(1).stores({
      recipes: 'id, name, yield, updatedAt',
      materials: 'id, name, unit',
      pendingMutations: '++id, target, type, createdAt',
    });
  }
}

export const db = new ChokoretoDB();
