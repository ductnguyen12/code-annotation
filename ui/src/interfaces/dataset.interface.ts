export interface Dataset {
  id: number | undefined;
  name: string;
  description: string;
  pLanguage?: string;
  demographicQuestionGroupIds?: number[];
  configuration?: any;
}

export interface DatasetStatistics {
  numberOfSnippets: number;
  numberOfParticipants: number;
  averageRating: number;
  dataset: Dataset;
  snippets: {
    [key: number]: {
      averageRating: number,
      numberOfParticipants: number,
    }
  };
}

export enum RaterMgmtSystem {
  LOCAL = 'LOCAL',
  PROLIFIC = 'PROLIFIC',
}