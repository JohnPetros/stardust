import { EventSchemas, Inngest } from 'inngest'
import { z } from 'zod'

import { UserCreatedEvent } from '@stardust/core/profile/events'
import { UserSignedUpEvent } from '@stardust/core/auth/events'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

const eventsSchema = {
  [UserCreatedEvent.name]: {
    data: z.object({
      userId: idSchema,
      acquiredRocketsIds: z.array(idSchema),
      acquiredAvatarsIds: z.array(idSchema),
    }),
  },
  [UserSignedUpEvent.name]: {
    data: z.object({
      userId: idSchema,
      userName: nameSchema,
      userEmail: emailSchema,
    }),
  },
}

export const inngest = new Inngest({
  id: 'stardust-queue',
  schemas: new EventSchemas().fromZod(eventsSchema),
})
