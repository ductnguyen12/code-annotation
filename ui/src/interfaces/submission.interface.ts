import { Rater } from "./rater.interface";

export interface Submission {
  id: string;
  rater: Rater;
  status: string;
  completedAt?: string;
  startedAt?: string;
  duration?: number;
  studyCode?: string;
  numberOfRatings: number;
  numberOfSnippets: number;
  passedAttentionCheck: number;
  totalAttentionCheck: number;
  consistentFailedAttentionCheck: number;
}
