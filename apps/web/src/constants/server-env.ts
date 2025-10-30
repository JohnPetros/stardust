import z from 'zod'

import { appModeSchema } from '@stardust/validation/global/schemas'

const serverEnv = {
  mode: process.env.MODE,
  inngestSigningKey: process.env.INNGEST_SIGNING_KEY,
  inngestEventKey: process.env.INNGEST_EVENT_KEY,
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
}

const schema = z.object({
  mode: appModeSchema,
  inngestSigningKey: z.string(),
  inngestEventKey: z.string(),
  googleAnalyticsId: z.string(),
})

export const SERVER_ENV = schema.parse(serverEnv)
