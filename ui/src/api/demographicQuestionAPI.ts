import axios, { AxiosResponse } from "axios";
import { DemographicQuestion, DemographicQuestionGroup } from "../interfaces/question.interface";

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

export const getDemographicQuestionGroups = async (params?: {
  datasetId?: number,
}): Promise<DemographicQuestionGroup[]> => {
  const response: AxiosResponse<DemographicQuestionGroup[]> = await axios.get<DemographicQuestionGroup[]>('/api/v1/demographic-question-groups', { params });
  return response.data;
}

export const createDemographicQuestionGroup = async (group: DemographicQuestionGroup): Promise<DemographicQuestionGroup> => {
  const response: AxiosResponse<DemographicQuestionGroup> = await axios.post<DemographicQuestionGroup>('/api/v1/demographic-question-groups', group);
  return response.data;
}

export const updateDemographicQuestionGroup = async (groupId: number, group: DemographicQuestionGroup): Promise<DemographicQuestionGroup> => {
  const response: AxiosResponse<DemographicQuestionGroup> = await axios.put<DemographicQuestionGroup>(`/api/v1/demographic-question-groups/${groupId}`, group);
  return response.data;
}

export const deleteDemographicQuestionGroup = async (groupId: number): Promise<void> => {
  await axios.delete(`/api/v1/demographic-question-groups/${groupId}`);
}