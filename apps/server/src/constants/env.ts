import { idSchema } from '@stardust/validation/global/schemas'
import { z } from 'zod'

const env = {
  mode: process.env.MODE,
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: getSupabasePublishableKey(),
  databaseUrl: process.env.SUPABASE_DATABASE_URL,
  mailpitApiUrl: process.env.MAILPIT_API_URL,
  s3Endpoint: process.env.S3_ENDPOINT,
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
  trustedProxyCidrs: process.env.TRUSTED_PROXY_CIDRS?.split(',')
    .map((value) => value.trim())
    .filter(Boolean),
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
    databaseUrl: z.string().url(),
    mailpitApiUrl: z.string().url().optional(),
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
    s3AccountId: z.string().optional(),
    s3AccessKeyId: z.string(),
    s3SecretAccessKey: z.string(),
    s3Endpoint: z.string().url().default('http://127.0.0.1:9000'),
    stardustWebUrl: z.string().url(),
    posthogProjectToken: z.string(),
    posthogHost: z.string().url(),
    posthogPersonalApiKey: z.string(),
    posthogProjectId: z.coerce.number().int().positive(),
    godAccountIds: z.array(idSchema),
    trustedProxyCidrs: z.array(z.string().min(1)).default([]),
  })
  .superRefine((value, context) => {
    if (value.mode === 'production' && !value.s3AccountId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['s3AccountId'],
        message: 'S3_ACCOUNT_ID is required in production mode',
      })
    }

    if (value.mode === 'test' && !value.mailpitApiUrl) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mailpitApiUrl'],
        message: 'MAILPIT_API_URL is required in test mode',
      })
    }

    if (value.mode === 'production' && value.trustedProxyCidrs.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['trustedProxyCidrs'],
        message: 'TRUSTED_PROXY_CIDRS is required in production mode',
      })
    }
  })

type LocalEndpointInput = {
  mode: 'development' | 'production' | 'test'
  supabaseUrl: string
  databaseUrl: string
  mailpitApiUrl?: string
  s3Endpoint: string
}

type LocalEndpointKey = keyof typeof LOCAL_ENDPOINTS

const LOCAL_ENDPOINTS = {
  supabaseUrl: { schemes: ['http:'] },
  databaseUrl: { schemes: ['postgres:', 'postgresql:'] },
  mailpitApiUrl: { schemes: ['http:'] },
  s3Endpoint: { schemes: ['http:'] },
} as const

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

function parseLocalEndpoint(input: LocalEndpointInput, key: LocalEndpointKey): URL {
  const value = input[key]
  if (!value) throw new Error(`${keyToVariableName(key)} must use a local endpoint`)

  try {
    return new URL(value)
  } catch {
    throw new Error(`${keyToVariableName(key)} must use a local endpoint`)
  }
}

function hasLocalEndpointOrigin(endpoint: URL, schemes: readonly string[]): boolean {
  const port = Number(endpoint.port)
  return (
    LOOPBACK_HOSTS.has(endpoint.hostname) &&
    Number.isInteger(port) &&
    port >= 1 &&
    port <= 65535 &&
    schemes.includes(endpoint.protocol)
  )
}

function hasMailpitRootAddress(endpoint: URL): boolean {
  return (
    endpoint.pathname === '/' &&
    !endpoint.search &&
    !endpoint.hash &&
    !endpoint.username &&
    !endpoint.password
  )
}

function validateLocalEndpoint(
  key: LocalEndpointKey,
  endpoint: URL,
  schemes: readonly string[],
): void {
  if (!hasLocalEndpointOrigin(endpoint, schemes)) {
    throw new Error(`${keyToVariableName(key)} must use a local endpoint`)
  }

  if (key === 'mailpitApiUrl' && !hasMailpitRootAddress(endpoint)) {
    throw new Error('MAILPIT_API_URL must use a local endpoint')
  }
}

export function validateLocalEndpoints(input: LocalEndpointInput): void {
  if (input.mode === 'production') return

  const configuredEndpoints = Object.entries(LOCAL_ENDPOINTS)
  const endpoints =
    input.mode === 'test'
      ? configuredEndpoints
      : configuredEndpoints.filter(([key]) => key !== 'mailpitApiUrl')

  for (const [key, expected] of endpoints) {
    const endpointKey = key as LocalEndpointKey
    validateLocalEndpoint(
      endpointKey,
      parseLocalEndpoint(input, endpointKey),
      expected.schemes,
    )
  }
}

function keyToVariableName(key: string): string {
  return (
    {
      supabaseUrl: 'SUPABASE_URL',
      databaseUrl: 'SUPABASE_DATABASE_URL',
      mailpitApiUrl: 'MAILPIT_API_URL',
      s3Endpoint: 'S3_ENDPOINT',
    }[key] ?? key
  )
}

const parsedEnv = envSchema.parse(env)
validateLocalEndpoints(parsedEnv)

export const ENV = parsedEnv

function getSupabasePublishableKey(): string | undefined {
  return (
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    (process.env.MODE === 'test' ? 'test-publishable-key' : undefined)
  )
}
