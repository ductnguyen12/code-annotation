import axios, { AxiosResponse } from "axios";
import { Snippet, SnippetRate } from "../interfaces/snippet.interface";

export const getSnippets = async (datasetId: number): Promise<Snippet[]> => {
  const response: AxiosResponse<Snippet[]> = await axios.get<Snippet[]>(
    '/api/v1/snippets',
    {
      params: {
        datasetId,
      }
    }
  );
  return response.data;
}

export const getDatasetSnippets = async (datasetId: number): Promise<Snippet[]> => {
  const response: AxiosResponse<Snippet[]> =
    await axios.get<Snippet[]>(`/api/v1/datasets/${datasetId}/snippets`, { withCredentials: true });
  return response.data;
}

export const createSnippet = async (snippet: Snippet): Promise<Snippet> => {
  const response: AxiosResponse<Snippet> = await axios.post<Snippet>('/api/v1/snippets', snippet);
  return response.data;
}

export const rateSnippet = async (snippetId: number, rate: SnippetRate): Promise<void> => {
  await axios.post(`/api/v1/snippets/${snippetId}/rates`, rate, { withCredentials: true });
}