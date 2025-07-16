import type { EventPayload } from '@stardust/core/global/types'
import type { Amqp, EventBroker, Job } from '@stardust/core/global/interfaces'
import type { AvatarsRepository, RocketsRepository } from '@stardust/core/shop/interfaces'
import { AcquireDefaultShopItemsUseCase } from '@stardust/core/shop/use-cases'
import type { FirstTierReachedEvent } from '@stardust/core/ranking/events'

type Payload = EventPayload<typeof FirstTierReachedEvent>

export class AcquireDefaultShopItemsJob implements Job<Payload> {
  static readonly KEY = 'shop/acquire.default.shop.items.job'

  constructor(
    private readonly rocketsRepository: RocketsRepository,
    private readonly avatarsRepository: AvatarsRepository,
    private readonly eventBroker: EventBroker,
  ) {}

  async handle(amqp: Amqp<Payload>) {
    const { user, firstStarId, firstTierId } = amqp.getPayload()
    const useCase = new AcquireDefaultShopItemsUseCase(
      this.rocketsRepository,
      this.avatarsRepository,
      this.eventBroker,
    )
    await amqp.run(
      async () => useCase.execute({ user, firstStarId, firstTierId }),
      AcquireDefaultShopItemsUseCase.name,
    )
  }
}
