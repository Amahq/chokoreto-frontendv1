import { IEntity } from "./IEntity";

export interface IRepository<T extends IEntity> {
  get(id: T["id"]): Promise<T | null>;
  list(): Promise<T[]>;
  create(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: T["id"]): Promise<void>;
}
