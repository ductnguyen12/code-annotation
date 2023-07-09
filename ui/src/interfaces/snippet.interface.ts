export interface Snippet {
  id: number;
  code: string;
  path: string;
  fromLine: number;
  toLine: number;
  datasetId: number;
  rate: SnippetRate | undefined;
}

export interface SnippetRate {
  value: number | undefined;
  comment: string | undefined;
}