import axios, { AxiosResponse } from "axios";
import { DemographicQuestion } from "../interfaces/question.interface";

export const getDemographicQuestions = async (): Promise<DemographicQuestion[]> => {
  const response: AxiosResponse<DemographicQuestion[]> = await axios.get<DemographicQuestion[]>('/api/v1/demographic-questions');
  return response.data;
}

export const createDemographicQuestion = async (question: DemographicQuestion): Promise<DemographicQuestion> => {
  const response: AxiosResponse<DemographicQuestion> = await axios.post<DemographicQuestion>('/api/v1/demographic-questions', question);
  return response.data;
}

export const updateDemographicQuestion = async (questionId: number, question: DemographicQuestion): Promise<DemographicQuestion> => {
  const response: AxiosResponse<DemographicQuestion> = await axios.put<DemographicQuestion>(`/api/v1/demographic-questions/${questionId}`, question);
  return response.data;
}

export const deleteDemographicQuestion = async (questionId: number): Promise<void> => {
  await axios.delete(`/api/v1/demographic-questions/${questionId}`);
}