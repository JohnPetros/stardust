import z from 'zod'

import { appModeSchema } from '@stardust/validation/global/schemas'

const serverEnv = {
  mode: process.env.MODE,
}

const schema = z.object({
  mode: appModeSchema,
})

export const SERVER_ENV = schema.parse(serverEnv)
