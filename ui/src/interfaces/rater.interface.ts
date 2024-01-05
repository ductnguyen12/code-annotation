import { Solution } from "./question.interface";

export interface Rater {
  id: string | undefined;
  externalId?: string;
  externalSystem?: string;
  solutions?: Array<Solution>;
  currentDatasetId?: number;
}