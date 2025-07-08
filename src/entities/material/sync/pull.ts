import { API_BASE_URL } from "../../../lib/config";
import type { Material } from "../MaterialModel";
import { isValidMaterial } from "../MaterialModel";

export async function pullMaterials(): Promise<Material[]> {
    const res = await fetch(`${API_BASE_URL}/api/materials?all=true`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token") || "",
        },
    });

    if (!res.ok) throw new Error("❌ Falló fetch de materiales");

    const data = await res.json();
    return (data as any[]).filter(isValidMaterial);
}
