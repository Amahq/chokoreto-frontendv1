import { API_BASE_URL } from "../../../lib/config";
import type { Material } from "../MaterialModel";

export async function pushMaterials(materials: Material[]): Promise<void> {
    for (const material of materials) {
        const res = await fetch(`${API_BASE_URL}/api/materials`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token") || "",
            },
            body: JSON.stringify(material),
        });

        if (!res.ok) {
            console.error("❌ Falló subida de material:", material);
            throw new Error("Falló sincronización de material");
        }
    }
}
