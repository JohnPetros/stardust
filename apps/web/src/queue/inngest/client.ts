import { EventSchemas, Inngest } from 'inngest'
import { z } from 'zod'

import { UserCreatedEvent } from '@stardust/core/profile/events'
import { UserSignedUpEvent } from '@stardust/core/auth/events'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

import { SERVER_ENV } from '@/constants/server-env'
import { ENV } from '@/constants/env'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'
import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import { FirstTierReachedEvent } from '@stardust/core/ranking/events'

const eventsSchema = {
  [UserCreatedEvent.NAME]: {
    data: z.object({
      userId: idSchema,
      acquiredRocketsIds: z.array(idSchema),
      acquiredAvatarsIds: z.array(idSchema),
    }),
  },
  [UserSignedUpEvent.NAME]: {
    data: z.object({
      userId: idSchema,
      userName: nameSchema,
      userEmail: emailSchema,
    }),
  },
  [FirstStarUnlockedEvent.NAME]: {
    data: z.object({
      user: z.object({
        id: idSchema,
        name: nameSchema,
        email: emailSchema,
      }),
      selectedAvatarByDefaultId: idSchema,
      selectedRocketByDefaultId: idSchema,
    }),
  },
  [ShopItemsAcquiredByDefaultEvent.NAME]: {
    data: z.object({
      user: z.object({
        id: idSchema,
        name: nameSchema,
        email: emailSchema,
      }),
      firstUnlockedStarId: idSchema,
    }),
  },
  [FirstTierReachedEvent.NAME]: {
    data: z.object({
      user: z.object({
        id: idSchema,
        name: nameSchema,
        email: emailSchema,
      }),
      selectedAvatarByDefaultId: idSchema,
      selectedRocketByDefaultId: idSchema,
      firstUnlockedStarId: idSchema,
      firstTierId: idSchema,
    }),
  },
}

export const inngest = new Inngest({
  id: 'StarDust Queue',
  eventKey: ENV.mode === 'production' ? SERVER_ENV.inngestEventKey : undefined,
  signingKey: ENV.mode === 'production' ? SERVER_ENV.inngestSigningKey : undefined,
  schemas: new EventSchemas().fromZod(eventsSchema),
})
