import type { Job, Amqp } from '@stardust/core/global/interfaces'
import { GetFirstTierIdUseCase } from '@stardust/core/ranking/use-cases'
import { FirstTierReachedEvent } from '@stardust/core/ranking/events'
import type { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import type { EventPayload } from '@stardust/core/global/types'
import type { RankingService } from '@stardust/core/ranking/interfaces'

type Payload = EventPayload<typeof ShopItemsAcquiredByDefaultEvent>

export const HandleShopItemsAcquiredByDefaultJob = (
  rankingService: RankingService,
): Job => {
  return {
    async handle(queue: Amqp<Payload>) {
      const useCase = new GetFirstTierIdUseCase(rankingService)
      const { firstTierId } = await queue.run<ReturnType<typeof useCase.execute>>(
        async () => useCase.execute(),
        GetFirstTierIdUseCase.name,
      )
      const shopEventPayload = queue.getPayload()

      const event = new FirstTierReachedEvent({ firstTierId, ...shopEventPayload })
      await queue.publish(event)
    },
  }
}
