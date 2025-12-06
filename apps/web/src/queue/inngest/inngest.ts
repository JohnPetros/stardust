import { EventSchemas, Inngest } from 'inngest'
import { z } from 'zod'

import { UserCreatedEvent } from '@stardust/core/profile/events'
import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'
import {
  FirstStarUnlockedEvent,
  PlanetsOrderChangedEvent,
  SpaceOrderChangedEvent,
  StarsOrderChangedEvent,
} from '@stardust/core/space/events'
import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import {
  FirstTierReachedEvent,
  RankingLosersDefinedEvent,
  RankingUpdatedEvent,
  RankingWinnersDefinedEvent,
} from '@stardust/core/ranking/events'
import { UserSignedInEvent, UserSignedUpEvent } from '@stardust/core/auth/events'

import { platformSchema } from '@stardust/validation/profile/schemas'
import { SERVER_ENV } from '@/constants/server-env'

const eventsSchema = {
  [UserCreatedEvent._NAME]: {
    data: z.object({
      userId: idSchema,
      acquiredRocketsIds: z.array(idSchema),
      acquiredAvatarsIds: z.array(idSchema),
    }),
  },
  [UserSignedUpEvent._NAME]: {
    data: z.object({
      userId: idSchema,
      userName: nameSchema,
      userEmail: emailSchema,
    }),
  },
  [FirstStarUnlockedEvent._NAME]: {
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
  [PlanetsOrderChangedEvent._NAME]: {},
  [StarsOrderChangedEvent._NAME]: {},
  [SpaceOrderChangedEvent._NAME]: {
    data: z.object({
      reorderedStarIds: z.array(idSchema),
    }),
  },
  [ShopItemsAcquiredByDefaultEvent._NAME]: {
    data: z.object({
      user: z.object({
        id: idSchema,
        name: nameSchema,
        email: emailSchema,
      }),
      firstUnlockedStarId: idSchema,
    }),
  },
  [FirstTierReachedEvent._NAME]: {
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
  [RankingWinnersDefinedEvent._NAME]: {
    data: z.object({
      tierId: idSchema,
      winnersIds: z.array(idSchema),
    }),
  },
  [RankingLosersDefinedEvent._NAME]: {
    data: z.object({
      tierId: idSchema,
      losersIds: z.array(idSchema),
    }),
  },
  [RankingUpdatedEvent._NAME]: {
    data: z.object({
      tierId: idSchema,
    }),
  },
  [UserSignedInEvent._NAME]: {
    data: z.object({
      userId: idSchema,
      platform: platformSchema,
    }),
  },
}

export const inngest = new Inngest({
  id: 'StarDust Web Queue',
  eventKey: SERVER_ENV.mode === 'production' ? SERVER_ENV.inngestEventKey : undefined,
  signingKey: SERVER_ENV.mode === 'production' ? SERVER_ENV.inngestSigningKey : undefined,
  schemas: new EventSchemas().fromZod(eventsSchema),
  isDev: SERVER_ENV.mode === 'development',
})
