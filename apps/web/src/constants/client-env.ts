import z from 'zod'

import { appModeSchema } from '@stardust/validation/global/schemas'

const clientEnv = {
  mode: process.env.MODE,
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
  stardustWebUrl: process.env.NEXT_PUBLIC_STARDUST_WEB_URL,
  stardustServerUrl: process.env.NEXT_PUBLIC_STARDUST_SERVER_URL,
  discordChannelUrl: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_URL,
  posthogProjectToken: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || undefined,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || undefined,
}

type ProductionRequiredEnv = {
  mode: string
  posthogProjectToken?: string
  posthogHost?: string
}

function addRequiredEnvIssue(
  context: z.RefinementCtx,
  path: 'posthogProjectToken' | 'posthogHost',
  name: string,
): void {
  context.addIssue({
    code: z.ZodIssueCode.custom,
    path: [path],
    message: `${name} is required in production`,
  })
}

function requirePostHogProjectToken(
  env: ProductionRequiredEnv,
  context: z.RefinementCtx,
): void {
  if (env.mode === 'production' && !env.posthogProjectToken) {
    addRequiredEnvIssue(
      context,
      'posthogProjectToken',
      'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN',
    )
  }
}

function requirePostHogHost(env: ProductionRequiredEnv, context: z.RefinementCtx): void {
  if (env.mode === 'production' && !env.posthogHost) {
    addRequiredEnvIssue(context, 'posthogHost', 'NEXT_PUBLIC_POSTHOG_HOST')
  }
}

const schema = z
  .object({
    mode: appModeSchema,
    cdnUrl: z.string().url(),
    stardustWebUrl: z.string().url(),
    stardustServerUrl: z.string().url(),
    discordChannelUrl: z.string().url(),
    posthogProjectToken: z.string().optional(),
    posthogHost: z.string().url().optional(),
  })
  .superRefine((env, context) => {
    requirePostHogProjectToken(env, context)
    requirePostHogHost(env, context)
  })

type LocalClientEndpoints = Pick<z.infer<typeof schema>, 'mode' | 'cdnUrl'>

const isLoopbackHostname = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'

const isLocalEndpoint = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' && isLoopbackHostname(url.hostname)
  } catch {
    return false
  }
}

const validateLocalEndpoint = (value: string, variableName: string) => {
  if (!isLocalEndpoint(value)) {
    throw new Error(`${variableName} must use a local endpoint in development`)
  }
}

export const validateLocalClientEndpoints = (input: LocalClientEndpoints): void => {
  // MODE is not reliable in the browser bundle under `next dev`; keep this
  // startup validation on the server, not in browser code or ServerMock tests.
  if (typeof window !== 'undefined' || input.mode !== 'development') return

  validateLocalEndpoint(input.cdnUrl, 'NEXT_PUBLIC_CDN_URL')
}

export const CLIENT_ENV = schema.parse(clientEnv)

validateLocalClientEndpoints(CLIENT_ENV)
