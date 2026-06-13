import z from 'zod'

import { appModeSchema } from '@stardust/validation/global/schemas'

const clientEnv = {
  mode: process.env.MODE,
  supabaseCdnUrl: process.env.NEXT_PUBLIC_SUPABASE_CDN_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  stardustWebUrl: process.env.NEXT_PUBLIC_STARDUST_WEB_URL,
  stardustServerUrl: process.env.NEXT_PUBLIC_STARDUST_SERVER_URL,
  discordChannelUrl: process.env.NEXT_PUBLIC_DISCORD_CHANNEL_URL,
  posthogProjectToken: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
}

const schema = z.object({
  mode: appModeSchema,
  supabaseCdnUrl: z.string().url(),
  supabaseUrl: z.string().url(),
  supabaseKey: z.string(),
  stardustWebUrl: z.string().url(),
  stardustServerUrl: z.string().url(),
  discordChannelUrl: z.string().url(),
  posthogProjectToken: z.string(),
  posthogHost: z.string().url(),
})

export const CLIENT_ENV = schema.parse(clientEnv)
