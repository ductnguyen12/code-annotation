import axios, { AxiosResponse } from "axios";
import { SnippetQuestion } from "../interfaces/snippet.interface";

export const createSnippetQuestion = async (question: SnippetQuestion): Promise<SnippetQuestion> => {
  const response: AxiosResponse<SnippetQuestion> = await axios.post<SnippetQuestion>('/api/v1/snippet-questions', question);
  return response.data;
}

export const deleteSnippetQuestion = async (questionId: number): Promise<void> => {
  await axios.delete(`/api/v1/snippet-questions/${questionId}`);
}