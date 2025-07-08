import { db } from "../../../lib/db";
import type { Material } from "../MaterialModel";

export async function listMaterials(): Promise<Material[]> {
    return await db.materials.toArray();
}
