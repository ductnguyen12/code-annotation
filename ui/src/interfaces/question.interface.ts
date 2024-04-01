import { Dataset } from "./dataset.interface";

export interface Question {
  id?: number;
  content?: string;
  type: QuestionType;
  constraint?: QuestionConstraint;
  answer?: Answer;
  solution?: Solution;            // Current user's solution
  solutions?: Array<Solution>;    // All solutions
}

export interface Answer {
  options?: Array<string>;
  attributes?: Array<string>;
  inputPositions?: Array<number>;
  correctChoices?: Array<number>;
}

export interface Solution {
  questionId: number;
  value: SolutionValue;
  raterId?: string;
  question?: Question;
}

export interface SolutionValue {
  input?: string | number;
  selected?: Array<number>;
}

export interface QuestionConstraint {
  required?: boolean;
  isNumber?: boolean;
}

export enum QuestionType {
  TEXT_ONLY = "TEXT_ONLY",
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  RATING = "RATING",
  INPUT = "INPUT",
  SNIPPET = "SNIPPET",
}

export interface QuestionSet {
  id?: number;
  title: string;
  description?: string;
  priority: number;
}

export interface DemographicQuestion extends Question {
  parentId?: number;
  groupIds?: Array<number>;
  subQuestions?: Array<DemographicQuestion>;
}

export interface DemographicQuestionGroup extends QuestionSet {
  datasets?: Array<Dataset>;
}