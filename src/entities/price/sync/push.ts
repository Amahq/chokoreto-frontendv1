import { API_BASE_URL } from "../../../lib/config";
import type { Price } from "../PriceModel";

export async function pushPrices(prices: Price[]): Promise<void> {
    for (const price of prices) {
        const payload = {
            material_id: price.materialId,
            price: price.price,
        };

        const res = await fetch(`${API_BASE_URL}/api/prices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token") || "",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            console.error("❌ Falló subida de precio:", price);
            throw new Error("Falló sincronización de precio");
        }
    }
}
