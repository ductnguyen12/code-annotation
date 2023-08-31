export interface Notification {
  key?: number;
  variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
  message?: string;
}