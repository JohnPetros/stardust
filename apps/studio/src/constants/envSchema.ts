import { z } from 'zod'

export const envSchema = z.object({
  VITE_SERVER_APP_URL: z.string().url(),
  VITE_CDN_URL: z.string().url(),
  VITE_WEB_APP_URL: z.string().url(),
})

export const parseEnv = (env: Record<string, unknown>) =>
  envSchema.parse({
    VITE_SERVER_APP_URL: env.VITE_SERVER_APP_URL,
    VITE_CDN_URL: env.VITE_CDN_URL,
    VITE_WEB_APP_URL: env.VITE_WEB_APP_URL,
  })
