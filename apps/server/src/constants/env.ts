import { idSchema } from '@stardust/validation/global/schemas'
import { z } from 'zod'

const env = {
  mode: process.env.MODE,
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: getSupabasePublishableKey(),
  databaseUrl: process.env.DATABASE_URL,
  onboardingReceiptSecret: process.env.ONBOARDING_RECEIPT_SECRET,
  mailpitApiUrl: getMailpitApiUrl(),
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
  sentryDsn: process.env.SENTRY_DSN || undefined,
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
    onboardingReceiptSecret: z
      .string()
      .refine(
        (value) => Buffer.byteLength(value) >= 32,
        'ONBOARDING_RECEIPT_SECRET must contain at least 32 bytes',
      ),
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
    sentryDsn: z.string().url().optional(),
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
    validateRequiredS3Account(value, context)
    validateRequiredMailpit(value, context)
    validateRequiredTrustedProxies(value, context)
    validateRequiredSentryDsn(value, context)
  })

type RequiredEnvironment = {
  mode: 'development' | 'production' | 'test'
  sentryDsn?: string
  s3AccountId?: string
  mailpitApiUrl?: string
  trustedProxyCidrs: string[]
}

function addRequiredEnvironmentIssue(
  context: z.RefinementCtx,
  path: keyof RequiredEnvironment,
  message: string,
): void {
  context.addIssue({ code: z.ZodIssueCode.custom, path: [path], message })
}

function validateRequiredS3Account(
  value: RequiredEnvironment,
  context: z.RefinementCtx,
): void {
  if (value.mode === 'production' && !value.s3AccountId) {
    addRequiredEnvironmentIssue(
      context,
      's3AccountId',
      'S3_ACCOUNT_ID is required in production mode',
    )
  }
}

function validateRequiredSentryDsn(
  value: RequiredEnvironment,
  context: z.RefinementCtx,
): void {
  if (value.mode === 'production' && !value.sentryDsn) {
    addRequiredEnvironmentIssue(
      context,
      'sentryDsn',
      'SENTRY_DSN is required in production mode',
    )
  }
}

function validateRequiredMailpit(
  value: RequiredEnvironment,
  context: z.RefinementCtx,
): void {
  if (value.mode === 'test' && !value.mailpitApiUrl) {
    addRequiredEnvironmentIssue(
      context,
      'mailpitApiUrl',
      'MAILPIT_API_URL is required in test mode',
    )
  }
}

function validateRequiredTrustedProxies(
  value: RequiredEnvironment,
  context: z.RefinementCtx,
): void {
  if (value.mode === 'production' && value.trustedProxyCidrs.length === 0) {
    addRequiredEnvironmentIssue(
      context,
      'trustedProxyCidrs',
      'TRUSTED_PROXY_CIDRS is required in production mode',
    )
  }
}

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

  return parseEndpointUrl(value, key)
}

function parseEndpointUrl(value: string, key: LocalEndpointKey): URL {
  try {
    return new URL(value)
  } catch {
    throw new Error(`${keyToVariableName(key)} must use a local endpoint`)
  }
}

function hasLocalEndpointOrigin(endpoint: URL, schemes: readonly string[]): boolean {
  return (
    LOOPBACK_HOSTS.has(endpoint.hostname) &&
    hasValidEndpointPort(endpoint) &&
    schemes.includes(endpoint.protocol)
  )
}

function hasValidEndpointPort(endpoint: URL): boolean {
  const port = Number(endpoint.port)
  return Number.isInteger(port) && port >= 1 && port <= 65535
}

function hasMailpitRootAddress(endpoint: URL): boolean {
  return (
    endpoint.pathname === '/' &&
    !endpoint.search &&
    !endpoint.hash &&
    hasNoEndpointCredentials(endpoint)
  )
}

function hasNoEndpointCredentials(endpoint: URL): boolean {
  return !endpoint.username && !endpoint.password
}

function validateMailpitAddress(key: LocalEndpointKey, endpoint: URL): void {
  if (key === 'mailpitApiUrl' && !hasMailpitRootAddress(endpoint)) {
    throw new Error('MAILPIT_API_URL must use a local endpoint')
  }
}

function validateLocalEndpoint(
  key: LocalEndpointKey,
  endpoint: URL,
  schemes: readonly string[],
): void {
  if (!hasLocalEndpointOrigin(endpoint, schemes)) {
    throw new Error(`${keyToVariableName(key)} must use a local endpoint`)
  }

  validateMailpitAddress(key, endpoint)
}

export function validateLocalEndpoints(input: LocalEndpointInput): void {
  if (input.mode === 'production') return

  const endpoints = selectLocalEndpoints(input.mode)

  for (const [key, expected] of endpoints) {
    validateConfiguredEndpoint(input, key, expected.schemes)
  }
}

function selectLocalEndpoints(mode: LocalEndpointInput['mode']) {
  const configuredEndpoints = Object.entries(LOCAL_ENDPOINTS)
  return mode === 'test'
    ? configuredEndpoints
    : configuredEndpoints.filter(([key]) => key !== 'mailpitApiUrl')
}

function validateConfiguredEndpoint(
  input: LocalEndpointInput,
  key: string,
  schemes: readonly string[],
): void {
  const endpointKey = key as LocalEndpointKey
  validateLocalEndpoint(endpointKey, parseLocalEndpoint(input, endpointKey), schemes)
}

function keyToVariableName(key: string): string {
  return (
    {
      supabaseUrl: 'SUPABASE_URL',
      databaseUrl: 'DATABASE_URL',
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

function getMailpitApiUrl(): string | undefined {
  return (
    process.env.MAILPIT_API_URL ||
    (process.env.MODE === 'test' ? 'http://127.0.0.1:54327' : undefined)
  )
}
