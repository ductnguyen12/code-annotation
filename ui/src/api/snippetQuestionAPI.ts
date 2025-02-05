import axios, { AxiosResponse } from "axios";
import { PatchRequest } from "../interfaces/common.interface";
import { QuestionPriority } from "../interfaces/question.interface";
import { SnippetQuestion } from "../interfaces/snippet.interface";

export const createSnippetQuestion = async (question: SnippetQuestion): Promise<SnippetQuestion> => {
  const response: AxiosResponse<SnippetQuestion> = await axios.post<SnippetQuestion>('/api/v1/snippet-questions', question);
  return response.data;
}

export const deleteSnippetQuestion = async (questionId: number): Promise<void> => {
  await axios.delete(`/api/v1/snippet-questions/${questionId}`);
}

export const patchSnippetQuestion = async (questionId: number, request: PatchRequest): Promise<SnippetQuestion> => {
  return (await axios.patch<SnippetQuestion>(`/api/v1/snippet-questions/${questionId}`, request)).data;
}

export const updateSnippetQuestionPriority = async (priority: QuestionPriority): Promise<void> => {
  await axios.post<QuestionPriority>('/api/v1/snippet-questions-priorities', priority);
}