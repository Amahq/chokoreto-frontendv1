import { db } from "../../../lib/db";
import type { Price } from "../PriceModel";

export async function listPrices(): Promise<Price[]> {
    return await db.prices.toArray();
}
