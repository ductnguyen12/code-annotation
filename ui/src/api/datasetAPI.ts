import axios, { AxiosResponse } from "axios";
import { Dataset } from "../interfaces/dataset.interface";

export const getDatasets = async (): Promise<Dataset[]> => {
  const response: AxiosResponse<Dataset[]> = await axios.get<Dataset[]>('/api/v1/datasets');
  return response.data;
}

export const getDataset = async (datasetId: number): Promise<Dataset[]> => {
  const response: AxiosResponse<Dataset[]> = await axios.get<Dataset[]>(`/api/v1/datasets/${datasetId}`);
  return response.data;
}

export const createDataset = async (dataset: Dataset): Promise<Dataset> => {
  const response: AxiosResponse<Dataset> = await axios.post<Dataset>('/api/v1/datasets', dataset);
  return response.data;
}