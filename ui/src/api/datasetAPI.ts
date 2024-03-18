import axios, { AxiosResponse } from "axios";
import { Page, PageParams } from "../interfaces/common.interface";
import { Dataset, DatasetStatistics } from "../interfaces/dataset.interface";
import { PredictedRating } from "../interfaces/model.interface";
import { downloadFile } from "./util";

export const getDatasets = async (): Promise<Dataset[]> => {
  const response: AxiosResponse<Dataset[]> = await axios.get<Dataset[]>('/api/v1/datasets');
  return response.data;
}

export const getDatasetPage = async (params: PageParams): Promise<Page<Dataset>> => {
  const response: AxiosResponse<Page<Dataset>> = await axios.get<Page<Dataset>>('/api/v1/datasets', {
    params,
  });
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

export const getDatasetStatistics = async (datasetId: number): Promise<DatasetStatistics> => {
  const response: AxiosResponse<DatasetStatistics> =
    await axios.get<DatasetStatistics>(`/api/v1/datasets/${datasetId}/statistics`);
  return response.data;
}

export const getDatasetPrediction = async (datasetId: number): Promise<PredictedRating[]> => {
  const response: AxiosResponse<PredictedRating[]> =
    await axios.get<PredictedRating[]>(`/api/v1/datasets/${datasetId}/predicted-ratings`, {
      params: { sort: 'lastModifiedDate,desc' }
    });
  return response.data;
}