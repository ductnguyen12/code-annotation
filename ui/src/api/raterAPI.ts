import axios, { AxiosResponse } from "axios";
import Cookies from "universal-cookie";
import { Rater, RaterAction } from "../interfaces/rater.interface";

const cookies = new Cookies();

export const registerAsRater = async (raterData: Rater): Promise<Rater> => {
  const response: AxiosResponse<Rater> = await axios.post<Rater>('/api/v1/raters/registration', raterData);
  const rater: Rater = response.data;
  return rater;
}

export const createRaterAction = async (action: RaterAction): Promise<RaterAction> => {
  const response: AxiosResponse<RaterAction> = await axios.post<RaterAction>('/api/v1/rater-actions', action, { withCredentials: true });
  const result: RaterAction = response.data;
  return result;
}

export const getRaterById = async (raterId: string): Promise<Rater> => {
  const response: AxiosResponse<Rater> = await axios.get<Rater>(`/api/v1/raters/${raterId}`);
  const rater: Rater = response.data;
  return rater;
}

export const getRaterByExternalInfo = async (externalSystem: string, externalId: string, datasetId: number): Promise<Rater> => {
  const response: AxiosResponse<Rater> = await axios.get<Rater>(`/api/v1/raters/${externalSystem}/${externalId}`, {
    params: {
      datasetId,
    }
  });
  const rater: Rater = response.data;
  return rater;
}

export const getCurrentRater = async (datasetId: number): Promise<Rater> => {
  const response: AxiosResponse<Rater> = await axios.get<Rater>('/api/v1/raters/me', {
    params: {
      datasetId,
    },
    withCredentials: true
  });
  const rater: Rater = response.data;
  return rater;
}

export const setRater = (rater: string | undefined | null) => {
  if (rater) {
    // TODO: set secure to cookies after having https domain
    cookies.set('token', rater, { path: '/', maxAge: 2 << 24 });   // maxAge ~ 388 days
  }
}

export const clearRater = () => {
  cookies.remove('token');
}
