import { db } from "../../../lib/db";
import type { Material } from "../MaterialModel";

export async function getMaterial(id: number): Promise<Material | null> {
    return (await db.materials.get(id)) ?? null;
}
