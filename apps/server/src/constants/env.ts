import { z } from 'zod'

const env = {
  mode: process.env.MODE,
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  inngestEventKey: process.env.INNGEST_EVENT_KEY,
  inngestSigningKey: process.env.INNGEST_SIGNING_KEY,
}

const envSchema = z.object({
  mode: z.enum(['development', 'production', 'test']),
  port: z.coerce.number().default(3333),
  baseUrl: z.string().url().default('http://localhost'),
  supabaseUrl: z.string().url(),
  supabaseKey: z.string(),
  inngestEventKey: z.string().optional(),
  inngestSigningKey: z.string().optional(),
})

export const ENV = envSchema.parse(env)
