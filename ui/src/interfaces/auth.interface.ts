export interface Login {
  username: string;
  password: string;
}

export interface AccessToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}