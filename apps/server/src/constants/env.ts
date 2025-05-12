import { z } from 'zod'

const env = {
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
}

const envSchema = z.object({
  port: z.coerce.number().default(3333),
  baseUrl: z.string().url().default('http://localhost'),
})

export const ENV = envSchema.parse(env)
