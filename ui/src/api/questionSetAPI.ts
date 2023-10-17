import axios, { AxiosResponse } from "axios";
import { QuestionSet } from "../interfaces/question.interface";

export const getQuestionSets = async (): Promise<QuestionSet[]> => {
  const response: AxiosResponse<QuestionSet[]> = await axios.get<QuestionSet[]>('/api/v1/question-sets');
  return response.data;
}

export const createQuestionSet = async (questionSet: QuestionSet): Promise<QuestionSet> => {
  const response: AxiosResponse<QuestionSet> = await axios.post<QuestionSet>('/api/v1/question-sets', questionSet);
  return response.data;
}

export const updateQuestionSet = async (questionSetId: number, questionSet: QuestionSet): Promise<QuestionSet> => {
  const response: AxiosResponse<QuestionSet> = await axios.put<QuestionSet>(`/api/v1/question-sets/${questionSetId}`, questionSet);
  return response.data;
}

export const deleteQuestionSet = async (questionSetId: number): Promise<void> => {
  await axios.delete(`/api/v1/question-sets/${questionSetId}`);
}

