import { z } from 'zod'

const env = {
  stardustServerUrl: import.meta.env.VITE_SERVER_APP_URL,
  supabaseCdnUrl: import.meta.env.VITE_SUPABASE_CDN_URL,
  webAppUrl: import.meta.env.VITE_WEB_APP_URL,
}

const envSchema = z.object({
  stardustServerUrl: z.string().url(),
  supabaseCdnUrl: z.string().url(),
  webAppUrl: z.string().url(),
})

export const ENV = envSchema.parse(env)
