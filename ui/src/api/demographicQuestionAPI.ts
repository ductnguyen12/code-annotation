import axios, { AxiosResponse } from "axios";
import { DemographicQuestion, QuestionSet } from "../interfaces/question.interface";

export const getDemographicQuestions = async (): Promise<DemographicQuestion[]> => {
  const response: AxiosResponse<DemographicQuestion[]> = await axios.get<DemographicQuestion[]>('/api/v1/rater-questions');
  return response.data;
}

export const createDemographicQuestion = async (questionSet: DemographicQuestion): Promise<DemographicQuestion> => {
  const response: AxiosResponse<DemographicQuestion> = await axios.post<DemographicQuestion>('/api/v1/rater-questions', questionSet);
  return response.data;
}

export const updateDemographicQuestion = async (questionSetId: number, questionSet: DemographicQuestion): Promise<DemographicQuestion> => {
  const response: AxiosResponse<DemographicQuestion> = await axios.put<DemographicQuestion>(`/api/v1/rater-questions/${questionSetId}`, questionSet);
  return response.data;
}

export const deleteDemographicQuestion = async (questionSetId: number): Promise<void> => {
  await axios.delete(`/api/v1/rater-questions/${questionSetId}`);
}