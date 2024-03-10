import axios, { AxiosResponse } from "axios";
import { Submission } from "../interfaces/submission.interface";

export const getSubmissions = async (datasetId: number): Promise<Submission[]> => {
  const response: AxiosResponse<Submission[]> = await axios.get<Submission[]>(
    `/api/v1/datasets/${datasetId}/submissions`,
    { withCredentials: true }
  );
  return response.data;
}
