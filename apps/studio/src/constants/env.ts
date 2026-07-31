import { parseEnv } from './envSchema'

const env = parseEnv(import.meta.env)

export const ENV = {
  stardustServerUrl: env.VITE_SERVER_APP_URL,
  cdnUrl: env.VITE_CDN_URL,
  stardustWebAppUrl: env.VITE_WEB_APP_URL,
}
