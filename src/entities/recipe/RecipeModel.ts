import { IEntity } from "../../core/interfaces/IEntity";

export interface Recipe extends IEntity {
  name: string;
  yield: number;
  procedure: string;
  image_url?: string;
  components: {
    id: number;
    component_type: "material" | "recipe";
    component_id: number;
    quantity: number;
  }[];
}

// Validación básica (puede usar zod más adelante)
export function isValidRecipe(data: any): data is Recipe {
  return (
    typeof data === "object" &&
    typeof data.id !== "undefined" &&
    typeof data.name === "string" &&
    typeof data.yield === "number" &&
    typeof data.procedure === "string" &&
    Array.isArray(data.components)
  );
}

// Inicializador (opcional)
export function createEmptyRecipe(): Recipe {
  return {
    id: Date.now(),
    name: "",
    yield: 1,
    procedure: "",
    image_url: "",
    components: [],
  };
}
