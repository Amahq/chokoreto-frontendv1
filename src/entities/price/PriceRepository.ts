import { db } from "../../lib/db";
import type { IRepository } from "../../core/interfaces/IRepository";
import type { Price } from "./PriceModel";

export class PriceRepository implements IRepository<Price> {
    async get(id: number): Promise<Price | null> {
        return (await db.prices.get(id)) ?? null;
    }

    async list(): Promise<Price[]> {
        return await db.prices.toArray();
    }

    async create(price: Price): Promise<void> {
        await db.prices.put(price);
    }

    async update(price: Price): Promise<void> {
        await db.prices.put(price);
    }

    async delete(id: number): Promise<void> {
        await db.prices.delete(id);
    }
}
