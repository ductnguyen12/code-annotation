import { DemographicQuestion, DemographicQuestionGroup, Solution } from "../../interfaces/question.interface";

export interface StepData {
  questionGroup?: DemographicQuestionGroup;
  questions: DemographicQuestion[];
  solutions: (Solution | undefined)[];
}