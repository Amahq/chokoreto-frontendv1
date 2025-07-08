import { db } from "../../../lib/db";
import type { Material } from "../MaterialModel";

export async function deleteMaterial(id: number): Promise<void> {
    await db.materials.delete(id);
}
