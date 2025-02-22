import { EventSchemas, Inngest } from 'inngest'
import { z } from 'zod'

import { UserCreatedEvent } from '@stardust/core/profile/events'
import { UserSignedUpEvent } from '@stardust/core/auth/events'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

import { SERVER_ENV } from '@/constants/server-env'
import { ENV } from '@/constants/env'

const eventsSchema = {
  [UserCreatedEvent.NAME]: {
    data: z.object({
      userId: z.string(),
      acquiredRocketsIds: z.array(idSchema),
      acquiredAvatarsIds: z.array(idSchema),
    }),
  },
  [UserSignedUpEvent.NAME]: {
    data: z.object({
      userId: z.string(),
      userName: nameSchema,
      userEmail: emailSchema,
    }),
  },
}

export const inngest = new Inngest({
  id: 'StarDust Queue',
  eventKey: ENV.mode === 'production' ? SERVER_ENV.inngestEventKey : undefined,
  signingKey: ENV.mode === 'production' ? SERVER_ENV.inngestSigningKey : undefined,
  schemas: new EventSchemas().fromZod(eventsSchema),
})
