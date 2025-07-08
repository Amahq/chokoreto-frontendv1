import { IEntity } from "../../core/interfaces/IEntity";

export interface Price extends IEntity {
    materialId: number;
    price: number;
    date: string;
}

export function isValidPrice(data: any): data is Price {
    return (
        typeof data === "object" &&
        typeof data.materialId === "number" &&
        typeof data.price === "number" &&
        typeof data.date === "string"
    );
}

export function createPrice(materialId: number, price: number): Price {
    return {
        id: Date.now(),
        materialId,
        price,
        date: new Date().toISOString(),
    };
}
