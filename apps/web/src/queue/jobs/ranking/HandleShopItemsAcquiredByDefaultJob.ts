import type { Job, Amqp, IRankingService } from '@stardust/core/global/interfaces'
import { GetFirstTierIdUseCase } from '@stardust/core/ranking/use-cases'
import { FirstTierReachedEvent } from '@stardust/core/ranking/events'
import type { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import type { EventPayload } from '@stardust/core/global/types'

type Payload = EventPayload<typeof ShopItemsAcquiredByDefaultEvent>

export const HandleShopItemsAcquiredByDefaultJob = (
  rankingService: IRankingService,
): Job => {
  return {
    async handle(queue: Amqp<Payload>) {
      const useCase = new GetFirstTierIdUseCase(rankingService)
      const { firstTierId } = await queue.run<ReturnType<typeof useCase.do>>(
        async () => useCase.do(),
        GetFirstTierIdUseCase.name,
      )
      const shopEventPayload = queue.getPayload()

      const event = new FirstTierReachedEvent({ firstTierId, ...shopEventPayload })
      await queue.publish(event)
    },
  }
}
