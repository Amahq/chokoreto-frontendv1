import { IEntity } from "../../core/interfaces/IEntity";

export interface Material extends IEntity {
    name: string;
    unit: string;
}

export function isValidMaterial(data: any): data is Material {
    return (
        typeof data === "object" &&
        typeof data.id !== "undefined" &&
        typeof data.name === "string" &&
        typeof data.unit === "string"
    );
}

export function createEmptyMaterial(): Material {
    return {
        id: Date.now(),
        name: "",
        unit: "",
    };
}
