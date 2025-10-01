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
  stardustWebUrl: process.env.WEB_APP_URL,
  dropboxRefreshToken: process.env.DROPBOX_REFRESH_TOKEN,
  dropboxAppKey: process.env.DROPBOX_APP_KEY,
  dropboxAppSecret: process.env.DROPBOX_APP_SECRET,
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  sentryDsn: process.env.SENTRY_DSN,
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
  dropboxRefreshToken: z.string(),
  dropboxAppKey: z.string(),
  dropboxAppSecret: z.string(),
  discordWebhookUrl: z.string().url(),
  sentryDsn: z.string().url(),
  stardustWebUrl: z.string().url(),
})

export const ENV = envSchema.parse(env)
