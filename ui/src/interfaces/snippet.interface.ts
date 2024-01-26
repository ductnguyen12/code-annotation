import { Question, Solution } from "./question.interface";
import { Rater } from "./rater.interface";

export interface Snippet {
  id: number;
  code: string;
  path: string;
  fromLine: number;
  toLine: number;
  datasetId: number;
  rate?: SnippetRate;           // Current user's ratings
  rates?: Array<SnippetRate>;   // All ratings
  questions?: Array<SnippetQuestion>;
  pLanguage?: string;
}

export interface SnippetRate {
  value: number;
  comment?: string;
  rater?: Rater;
  solutions?: Array<Solution>;
}

export interface SnippetQuestion extends Question {
}