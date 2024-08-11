import { Solution } from "./question.interface";

export interface Rater {
  id: string | undefined;
  externalId?: string;
  externalSystem?: string;
  solutions?: Array<Solution>;
  currentDatasetId?: number;
}

export interface RaterAction {
  id?: string;
  raterId?: string;
  datasetId: number;
  action: RaterActionType;
  data?: any;
}

export enum RaterActionType {
  ENTER_RATING_PAGE = "ENTER_RATING_PAGE",
  CHANGE_SNIPPET = "CHANGE_SNIPPET",
  SET_QUESTION_SOLUTION = "SET_QUESTION_SOLUTION",
  SET_RATING = "SET_RATING",
  SET_NO_RATING = "SET_NO_RATING",
  SUBMIT = "SUBMIT",
}