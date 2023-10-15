import { Question, Solution } from "./question.interface";

export interface Rater {
  id: string | undefined;
  solutions?: Array<Solution>;
}

export interface RaterQuestion extends Question {
  solutions?: Array<Solution>;
}