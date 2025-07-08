export interface ISyncStrategy<T> {
  pull(): Promise<T[]>;                    // sincroniza desde backend → local
  push(localEntities: T[]): Promise<void>; // sincroniza local → backend
}
