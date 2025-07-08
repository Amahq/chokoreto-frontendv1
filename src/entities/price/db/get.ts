import { db } from "../../../lib/db";
import type { Price } from "../PriceModel";

export async function getPrice(id: number): Promise<Price | null> {
    return (await db.prices.get(id)) ?? null;
}
