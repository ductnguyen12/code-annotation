import { Solution } from "./question.interface";

export interface Rater {
  id: string | undefined;
  solutions?: Array<Solution>;
}