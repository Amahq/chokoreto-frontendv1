import { API_BASE_URL } from "../../../lib/config";
import type { Price } from "../PriceModel";
import { isValidPrice } from "../PriceModel";

export async function pullPrices(): Promise<Price[]> {
    const res = await fetch(`${API_BASE_URL}/api/prices?all=true`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token") || "",
        },
    });

    if (!res.ok) throw new Error("❌ Falló fetch de precios");

    const data = await res.json();

    return (data as any[]).filter(isValidPrice);
}
