export interface Dataset {
  id: number | undefined;
  name: string;
  description: string;
  configuration?: any;
}

export enum RaterMgmtSystem {
  LOCAL = 'LOCAL',
  PROLIFIC = 'PROLIFIC',
}