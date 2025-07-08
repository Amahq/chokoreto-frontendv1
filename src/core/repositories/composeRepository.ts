import type { IEntity } from "../interfaces/IEntity";
import type { IRepository } from "../interfaces/IRepository";
import type { IMutationQueue } from "../interfaces/IMutationQueue";
import type { ISyncStrategy } from "../interfaces/ISyncStrategy";
import type { MutationType } from "../interfaces/IMutationQueue";

export function composeRepository<T extends IEntity>(options: {
  local: IRepository<T>;
  queue: IMutationQueue<T>;
  sync: ISyncStrategy<T>;
}): IRepository<T> {
  const { local, queue } = options;

  return {
    async get(id: T["id"]) {
      return local.get(id);
    },

    async list() {
      return local.list();
    },

    async create(entity: T) {
      await local.create(entity);
      await queue.add({
        type: "create",
        entity,
        timestamp: new Date().toISOString(),
      });
    },

    async update(entity: T) {
      await local.update(entity);
      await queue.add({
        type: "update",
        entity,
        timestamp: new Date().toISOString(),
      });
    },

    async delete(id: T["id"]) {
      const existing = await local.get(id);
      if (!existing) return;
      await local.delete(id);
      await queue.add({
        type: "delete",
        entity: existing,
        timestamp: new Date().toISOString(),
      });
    },
  };
}
