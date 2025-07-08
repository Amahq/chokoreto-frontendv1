import { IEntity } from "./IEntity";

export type MutationType = "create" | "update" | "delete";

export interface IMutation<T extends IEntity> {
  type: MutationType;
  entity: T;
  timestamp: string; // ISO string
}

export interface IMutationQueue<T extends IEntity> {
  add(mutation: IMutation<T>): Promise<void>;
  remove(mutation: IMutation<T>): Promise<void>;
  list(): Promise<IMutation<T>[]>;
  hasPending(): Promise<boolean>;
  clear(): Promise<void>;
}
