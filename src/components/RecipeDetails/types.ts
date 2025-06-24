export interface MaterialComponent {
  type: "material";
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

export interface SubRecipeComponent {
  type: "recipe";
  id: number;
  name: string;
  quantity: number;
  yield: number;
  procedure: string;
  image_url?: string;
  components: Component[];
}

export type Component = MaterialComponent | SubRecipeComponent;

export interface RecipeData {
  id: number;
  name: string;
  yield: number;
  procedure: string;
  image_url?: string;
  components: Component[];
}

export interface MaterialCost {
  name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  cost: number;
}

export interface Material {
  id: number;
  name: string;
  unit: string;
}

export interface RecipeRef {
  id: number;
  name: string;
  yield: number;
}