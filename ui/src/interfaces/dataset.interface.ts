export interface Dataset {
  id: number | undefined;
  name: string;
  description: string;
  pLanguage?: string;
  demographicQuestionGroupIds?: number[],
  configuration?: any;
}

export enum RaterMgmtSystem {
  LOCAL = 'LOCAL',
  PROLIFIC = 'PROLIFIC',
}