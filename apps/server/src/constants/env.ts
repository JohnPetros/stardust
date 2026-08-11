import { idSchema } from '@stardust/validation/global/schemas'
import { z } from 'zod'

const env = {
  mode: process.env.MODE,
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE,
  databaseUrl: process.env.SUPABASE_DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  inngestEventKey: process.env.INNGEST_EVENT_KEY,
  inngestSigningKey: process.env.INNGEST_SIGNING_KEY ?? process.env.inngestSigningKey,
  stardustWebUrl: process.env.STARDUST_WEB_URL,
  posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
  posthogHost: process.env.POSTHOG_HOST,
  posthogPersonalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
  posthogProjectId: process.env.POSTHOG_PROJECT_ID,
  dropboxRefreshToken: process.env.DROPBOX_REFRESH_TOKEN,
  dropboxAppKey: process.env.DROPBOX_APP_KEY,
  dropboxAppSecret: process.env.DROPBOX_APP_SECRET,
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  resendApiKey: process.env.RESEND_API_KEY,
  resendFromEmail: process.env.RESEND_FROM_EMAIL,
  openaiApiKey: process.env.OPENAI_API_KEY,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY,
  godAccountIds: process.env.GOD_ACCOUNT_IDS?.split(',').filter(Boolean),
  sentryDsn: process.env.SENTRY_DSN,
  s3AccountId: process.env.S3_ACCOUNT_ID,
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
}

const envSchema = z
  .object({
    mode: z.enum(['development', 'production', 'test']),
    port: z.coerce.number().default(3333),
    baseUrl: z.string().url().default('http://localhost'),
    supabaseUrl: z.string().url(),
    supabaseKey: z.string(),
    supabaseServiceRole: z.string().optional(),
    databaseUrl: z.string().url(),
    redisUrl: z.string().url(),
    inngestEventKey: z.string().optional(),
    inngestSigningKey: z.string().optional(),
    dropboxRefreshToken: z.string(),
    dropboxAppKey: z.string(),
    dropboxAppSecret: z.string(),
    discordWebhookUrl: z.string().url(),
    resendApiKey: z.string().optional(),
    resendFromEmail: z.string().email().optional(),
    openaiApiKey: z.string().optional(),
    openrouterApiKey: z.string().optional(),
    elevenLabsApiKey: z.string().optional(),
    sentryDsn: z.string().url(),
    s3AccountId: z.string(),
    s3AccessKeyId: z.string(),
    s3SecretAccessKey: z.string(),
    stardustWebUrl: z.string().url(),
    posthogProjectToken: z.string(),
    posthogHost: z.string().url(),
    posthogPersonalApiKey: z.string(),
    posthogProjectId: z.coerce.number().int().positive(),
    godAccountIds: z.array(idSchema),
  })
  .superRefine((value, context) => {
    if (value.mode !== 'test' && !value.supabaseServiceRole) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['supabaseServiceRole'],
        message: 'SUPABASE_SERVICE_ROLE is required outside test mode',
      })
    }
  })

export const ENV = envSchema.parse(env)
