import { DemographicQuestion, DemographicQuestionGroup } from "../../interfaces/question.interface";

export interface StepData {
  questionGroup?: DemographicQuestionGroup;
  questions: DemographicQuestion[];
}