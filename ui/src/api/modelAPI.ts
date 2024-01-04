import axios, { AxiosResponse } from "axios";
import { Page } from "../interfaces/common.interface";
import { Model, ModelExecution, ModelExecutionParams } from "../interfaces/model.interface";

export const getModels = async (): Promise<Model[]> => {
  const response: AxiosResponse<Model[]> = await axios.get<Model[]>('/api/v1/models');
  return response.data;
}

export const createModel = async (model: Model): Promise<Model> => {
  const response: AxiosResponse<Model> = await axios.post<Model>('/api/v1/models', model);
  return response.data;
}

export const updateModel = async (modelId: number, model: Model): Promise<Model> => {
  const response: AxiosResponse<Model> = await axios.put<Model>(`/api/v1/models/${modelId}`, model);
  return response.data;
}

export const deleteModel = async (modelId: number): Promise<void> => {
  await axios.delete(`/api/v1/models/${modelId}`);
}

export const getModelExecutions = async (params: ModelExecutionParams): Promise<Page<ModelExecution>> => {
  const response: AxiosResponse<Page<ModelExecution>> =
    await axios.get<Page<ModelExecution>>('/api/v1/model-executions', { params });
  return response.data;
}

export const createModelExecution = async (execution: ModelExecution): Promise<ModelExecution> => {
  const response: AxiosResponse<ModelExecution> =
    await axios.post<ModelExecution>('/api/v1/model-executions', execution);
  return response.data;
}
