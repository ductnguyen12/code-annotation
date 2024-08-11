declare global {
  interface Window {
    env: any
  }
}

type EnvType = {
  REACT_APP_BACKEND: string,
  REACT_APP_ENABLE_HTTPS: string,
}
export const env: EnvType = { ...process.env, ...window.env }