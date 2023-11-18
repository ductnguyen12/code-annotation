import axios, { AxiosResponse } from "axios";
import { Dataset } from "../interfaces/dataset.interface";
import { downloadFile } from "./util";

export const getDatasets = async (): Promise<Dataset[]> => {
  const response: AxiosResponse<Dataset[]> = await axios.get<Dataset[]>('/api/v1/datasets');
  return response.data;
}

export const getDataset = async (datasetId: number): Promise<Dataset> => {
  const response: AxiosResponse<Dataset> = await axios.get<Dataset>(`/api/v1/datasets/${datasetId}`, { withCredentials: true });
  return response.data;
}

export const createDataset = async (dataset: Dataset): Promise<Dataset> => {
  const response: AxiosResponse<Dataset> = await axios.post<Dataset>('/api/v1/datasets', dataset);
  return response.data;
}

export const updateDataset = async (datasetId: number, dataset: Dataset): Promise<Dataset> => {
  const response: AxiosResponse<Dataset> = await axios.put<Dataset>(`/api/v1/datasets/${datasetId}`, dataset);
  return response.data;
}

export const deleteDataset = async (datasetId: number): Promise<void> => {
  await axios.delete<void>(`/api/v1/datasets/${datasetId}`);
}

export const importDatasetSnippets = async (datasetId: number, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  await axios.post(`/api/v1/datasets/${datasetId}/import-snippets`, formData);
}

export const exportDatasetSnippets = async (datasetId: number): Promise<void> => {
  await downloadFile(`/api/v1/datasets/${datasetId}/export-snippets`, `dataset-${datasetId}-snippets.zip`);
}