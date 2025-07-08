import { db } from "../../../lib/db";
import type { Price } from "../PriceModel";

export async function deletePrice(id: number): Promise<void> {
    await db.prices.delete(id);
}
