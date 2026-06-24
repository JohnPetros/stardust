import z from 'zod'

import { appModeSchema } from '@stardust/validation/global/schemas'

const serverEnv = {
  mode: process.env.MODE,
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
}

const schema = z.object({
  mode: appModeSchema,
  openrouterApiKey: z.string().optional(),
})

export const SERVER_ENV = schema.parse(serverEnv)
