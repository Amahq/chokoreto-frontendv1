import { db } from "../../../lib/db";
import type { Price } from "../PriceModel";
import type { IMutationQueue, IMutation } from "../../../core/interfaces/IMutationQueue";

export class PriceQueue implements IMutationQueue<Price> {
    private target = "prices";

    async add(mutation: IMutation<Price>): Promise<void> {
        await db.pendingMutations.add({
            id: crypto.randomUUID(),
            type: mutation.type,
            target: this.target,
            payload: mutation.entity,
            createdAt: mutation.timestamp,
        });
    }

    async remove(mutation: IMutation<Price>): Promise<void> {
        const all = await db.pendingMutations.toArray();
        const found = all.find(
            (m) =>
                m.target === this.target &&
                JSON.stringify(m.payload) === JSON.stringify(mutation.entity)
        );
        if (found?.id) await db.pendingMutations.delete(found.id);
    }

    async list(): Promise<IMutation<Price>[]> {
        const raw = await db.pendingMutations.where("target").equals(this.target).toArray();
        return raw.map((m) => ({
            type: m.type,
            entity: m.payload,
            timestamp: m.createdAt,
        }));
    }

    async hasPending(): Promise<boolean> {
        return (await db.pendingMutations.where("target").equals(this.target).count()) > 0;
    }

    async clear(): Promise<void> {
        await db.pendingMutations.where("target").equals(this.target).delete();
    }
}
