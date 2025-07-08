import { db } from "../../../lib/db";
import type { Material } from "../MaterialModel";

export async function createMaterial(material: Material): Promise<void> {
    await db.materials.put(material);
}
