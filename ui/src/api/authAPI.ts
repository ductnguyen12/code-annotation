import axios, { AxiosResponse } from "axios";
import { AccessToken, Login } from "../interfaces/auth.interface";
import { User } from "../interfaces/user.interface";
import { clearRater, setRater } from "./raterAPI";

export const signIn = async (login: Login): Promise<AccessToken> => {
  const response: AxiosResponse<AccessToken> = await axios.post<AccessToken>('/api/v1/auth/token', login);
  const token: AccessToken = response.data;
  saveToken(token);
  setupTokenForAxios();

  return token;
}

export const signOut = () => {
  clearToken();
  clearRater();
}

export const refreshToken = async (refreshToken: string): Promise<AccessToken> => {
  const response: AxiosResponse<AccessToken> = await axios.post<AccessToken>(
    '/api/v1/auth/refresh-token',
    undefined,
    { headers: { Authorization: refreshToken } }
  );
  const token: AccessToken = response.data;
  saveToken(token);
  setupTokenForAxios();

  return token;
}

export const getCurrentUser = async (): Promise<User> => {
  const response: AxiosResponse<User> = await axios.get<User>('/api/v1/auth/me', { withCredentials: true });
  setRater(response.data.raterId);
  return response.data;
}

const setupTokenForAxios = () => {
  const token: AccessToken = loadToken();

  axios.interceptors.request.use(
    async (config: any) => {
      const time = new Date().getTime();

      if (!token.accessToken
        || config.url.includes('/refresh-token')) {
        return config;
      }
      // Access token will be expired in less than 5s
      if (token.expiresIn - time < 5000) {
        // Refresh token will be expired in more than 5s
        if (token.refreshExpiresIn - time > 5000 && !!token.refreshToken) {
          refreshToken(token.refreshToken);
        } else {
          console.log("Session expired");
          signOut();
        }
      } else {
        config.headers.Authorization = `${token.tokenType} ${token.accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}

const saveToken = (token: AccessToken) => {
  const now = new Date().getTime();   // in milliseconds
  localStorage.setItem("token", token.accessToken);
  localStorage.setItem("type", token.tokenType);
  localStorage.setItem("refresh", token.refreshToken);
  localStorage.setItem("expired", now + (token.expiresIn * 1000) + "");
  localStorage.setItem("refreshExpiresIn", now + (token.refreshExpiresIn * 1000) + "");
}

const loadToken = (): AccessToken => {
  return {
    accessToken: localStorage.getItem("token") || "",
    tokenType: localStorage.getItem("type") || "",
    refreshToken: localStorage.getItem("refresh") || "",
    expiresIn: parseInt(localStorage.getItem("expired") || "0"),
    refreshExpiresIn: parseInt(localStorage.getItem("refreshExpiresIn") || "0"),
  }
};

const clearToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("type");
  localStorage.removeItem("expired");
  localStorage.removeItem("refreshExpiresIn");
};

setupTokenForAxios();   // First time setup (in case that browser was refreshed)