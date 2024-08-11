import { env } from "./env";

const config = {
  https: 'true' === env.REACT_APP_ENABLE_HTTPS,
}

export default config;
