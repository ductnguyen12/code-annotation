export interface Snippet {
  id: number;
  code: string;
  path: string;
  fromLine: number;
  toLine: number;
  datasetId: number;
  rate: SnippetRate | undefined;
  questions?: Array<Question>;
}

export interface SnippetRate {
  value: number | undefined;
  comment: string | undefined;
  selectedAnswers?: Array<number>;
}

export interface Question {
  id?: number;
  content?: string;
  answers?: Array<Answer>;
}

export interface Answer {
  id?: number;
  content?: string;
  rightAnswer?: boolean;
  selected?: boolean;
}