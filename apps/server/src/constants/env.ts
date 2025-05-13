import { z } from 'zod'

const env = {
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
}

const envSchema = z.object({
  port: z.coerce.number().default(3333),
  baseUrl: z.string().url().default('http://localhost'),
  supabaseUrl: z.string().url(),
  supabaseKey: z.string(),
})

export const ENV = envSchema.parse(env)
