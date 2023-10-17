export interface Question {
  id?: number;
  content?: string;
  type: QuestionType;
  constraint?: QuestionConstraint;
  answer?: Answer;
  questionSetId?: number;
}

export interface Answer {
  options?: Array<string>;
  attributes?: Array<string>;
  inputPositions?: Array<string>;
  correctChoices?: Array<number>;
}

export interface Solution {
  questionId: number;
  value: SolutionValue;
  question?: Question;
}

export interface SolutionValue {
  input?: string;
  selected?: Array<number>;
}

export interface QuestionConstraint {
  required?: boolean;
  isNumber?: boolean;
}

export enum QuestionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  RATING = "RATING",
  INPUT = "INPUT",
}

export interface QuestionSet {
  id?: number;
  title: string;
  description?: string;
  priority: number;
}