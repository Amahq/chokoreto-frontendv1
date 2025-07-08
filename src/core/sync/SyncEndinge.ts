import type { IEntity } from "../interfaces/IEntity";
import type { IMutationQueue, IMutation } from "../interfaces/IMutationQueue";
import type { ISyncStrategy } from "../interfaces/ISyncStrategy";

export class SyncEngine {
  private queues: Record<string, IMutationQueue<IEntity>>;
  private strategies: Record<string, ISyncStrategy<IEntity>>;

  constructor() {
    this.queues = {};
    this.strategies = {};
  }

  register<T extends IEntity>(
    entityName: string,
    queue: IMutationQueue<T>,
    strategy: ISyncStrategy<T>
  ) {
    this.queues[entityName] = queue as IMutationQueue<IEntity>;
    this.strategies[entityName] = strategy as ISyncStrategy<IEntity>;
  }

  async syncAll() {
    for (const entityName of Object.keys(this.queues)) {
      await this.sync(entityName);
    }
  }

  async sync(entityName: string) {
    const queue = this.queues[entityName];
    const strategy = this.strategies[entityName];
    if (!queue || !strategy) return;

    const mutations = await queue.list();

    for (const mutation of mutations) {
      try {
        if (mutation.type === "create" || mutation.type === "update") {
          await strategy.push([mutation.entity]);
        } else if (mutation.type === "delete") {
          // en este enfoque, DELETE también se trata como push, o podrías tener strategy.delete()
          await strategy.push([mutation.entity]);
        }

        await queue.remove(mutation);
      } catch (err) {
        console.error(`❌ Falló sync para ${entityName}:`, err);
      }
    }

    // Luego de vaciar la cola, opcionalmente pull
    try {
      const remoteEntities = await strategy.pull();
      console.log(`✅ Sync de ${entityName}: ${remoteEntities.length} entidades desde backend`);
      // Aquí podrías llamar a un repositorio local para actualizar los datos
    } catch (err) {
      console.warn(`⚠️ No se pudo hacer pull de ${entityName}:`, err);
    }
  }
}
