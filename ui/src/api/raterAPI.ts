import axios, { AxiosResponse } from "axios";
import Cookies from "universal-cookie";
import { Rater } from "../interfaces/rater.interface";

const cookies = new Cookies();

export const registerAsRater = async (raterData: Rater): Promise<Rater> => {
  const response: AxiosResponse<Rater> = await axios.post<Rater>('/api/v1/raters/registration', raterData);
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
