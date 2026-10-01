import z from 'zod'

import { appModeSchema } from '@stardust/validation/global/schemas'

const clientEnv = {
  mode: process.env.MODE,
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    (process.env.NODE_ENV === 'test' || process.env.MODE === 'testing'
      ? 'test-publishable-key'
      : undefined),
  stardustWebUrl: process.env.NEXT_PUBLIC_STARDUST_WEB_URL,
  stardustServerUrl: process.env.NEXT_PUBLIC_STARDUST_SERVER_URL,
  discordChannelUrl: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_URL,
  posthogProjectToken: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
}

const schema = z.object({
  mode: appModeSchema,
  cdnUrl: z.string().url(),
  supabaseUrl: z.string().url(),
  supabaseKey: z.string(),
  stardustWebUrl: z.string().url(),
  stardustServerUrl: z.string().url(),
  discordChannelUrl: z.string().url(),
  posthogProjectToken: z.string(),
  posthogHost: z.string().url(),
})

type LocalClientEndpoints = Pick<
  z.infer<typeof schema>,
  'mode' | 'cdnUrl' | 'supabaseUrl'
>

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

  validateLocalEndpoint(input.supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL')
  validateLocalEndpoint(input.cdnUrl, 'NEXT_PUBLIC_CDN_URL')
}

export const CLIENT_ENV = schema.parse(clientEnv)

validateLocalClientEndpoints(CLIENT_ENV)
