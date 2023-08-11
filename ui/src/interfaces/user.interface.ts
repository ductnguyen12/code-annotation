export interface User {
  id: string;
  username: string;
  enabled: boolean;
  superAdmin: boolean;
  raterId: string | undefined;
}