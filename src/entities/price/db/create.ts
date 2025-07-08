import { db } from "../../../lib/db";
import type { Price } from "../PriceModel";

export async function createPrice(price: Price): Promise<void> {
    await db.prices.put(price);
}
