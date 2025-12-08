import z from 'zod'

import { appModeSchema } from '@stardust/validation/global/schemas'

const serverEnv = {
  mode: process.env.MODE,
  inngestEventKey: process.env.INNGEST_EVENT_KEY,
  inngestSigningKey: process.env.INNGEST_SIGNING_KEY,
}

const schema = z.object({
  mode: appModeSchema,
  inngestEventKey: z.string().optional(),
  inngestSigningKey: z.string().optional(),
})

export const SERVER_ENV = schema.parse(serverEnv)
