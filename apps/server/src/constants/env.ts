import { z } from 'zod'

const env = {
  mode: process.env.MODE,
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  databaseUrl: process.env.SUPABASE_DATABASE_URL,
  inngestEventKey: process.env.INNGEST_EVENT_KEY,
  inngestSigningKey: process.env.INNGEST_SIGNING_KEY,
  webAppUrl: process.env.WEB_APP_URL,
  dropboxAccessToken: process.env.DROPBOX_ACCESS_TOKEN,
}

const envSchema = z.object({
  mode: z.enum(['development', 'production', 'test']),
  port: z.coerce.number().default(3333),
  baseUrl: z.string().url().default('http://localhost'),
  supabaseUrl: z.string().url(),
  supabaseKey: z.string(),
  databaseUrl: z.string().url(),
  inngestEventKey: z.string().optional(),
  inngestSigningKey: z.string().optional(),
  webAppUrl: z.string().url(),
  dropboxAccessToken: z.string().optional(),
})

export const ENV = envSchema.parse(env)
