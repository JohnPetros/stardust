import { z } from 'zod'

const env = {
  serverAppUrl: process.env.VITE_SERVER_APP_URL,
}

const envSchema = z.object({
  serverAppUrl: z.string().url(),
})

export const ENV = envSchema.parse(env)
