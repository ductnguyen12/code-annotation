import { PageParams } from "./common.interface";

export interface Model {
  id?: number;
  name: string;
  executionType: ExecutionType;
  outputFormat: OutputFormat;
  ratingScale: number;
  config: {
    [key: string]: any;
  };
}

export interface ModelExecution {
  id?: string;
  targetType: PredictionTarget;
  targetId: number;
  modelId: number;
  state?: ExecutionState;
  errorMsg?: string;
  lastModifiedDate?: Date;
}

export interface ModelExecutionParams extends PageParams {
  targetType?: PredictionTarget;
  targetId?: number;
  modelId?: number;
}

export interface PredictedRating {
  snippetId: number;
  modelId: number;
  value?: number;
  metrics?: {
    [key: string]: number;
  };
  execution: ModelExecution;
}

export enum ExecutionType {
  COMMAND_LINE = "COMMAND_LINE",
}

export enum OutputFormat {
  RSE = "RSE",
}

export enum PredictionTarget {
  DATASET = "DATASET",
  SNIPPET = "SNIPPET",
}

export enum ExecutionState {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}