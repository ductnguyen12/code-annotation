import { Rater } from "./rater.interface";

export interface Submission {
  id: string;
  rater: Rater;
  status: string;
  completedAt?: string;
  startedAt?: string;
  studyCode?: string;
}
