import { UniqueIdentifier } from "@dnd-kit/core";

export interface Item {
  id: UniqueIdentifier;
  [key: string]: any;
}