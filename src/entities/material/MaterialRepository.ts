import { db } from "../../lib/db";
import type { Material } from "./MaterialModel";
import type { IRepository } from "../../core/interfaces/IRepository";

export class MaterialRepository implements IRepository<Material> {
    async get(id: number): Promise<Material | null> {
        return (await db.materials.get(id)) ?? null;
    }

    async list(): Promise<Material[]> {
        return await db.materials.toArray();
    }

    async create(material: Material): Promise<void> {
        await db.materials.put(material);
    }

    async update(material: Material): Promise<void> {
        await db.materials.put(material);
    }

    async delete(id: number): Promise<void> {
        await db.materials.delete(id);
    }
}
