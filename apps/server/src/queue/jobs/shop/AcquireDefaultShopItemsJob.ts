import type { Database } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { Amqp, Broker, Job } from '@stardust/core/global/interfaces'
import type { AvatarsRepository, RocketsRepository } from '@stardust/core/shop/interfaces'
import { AcquireDefaultShopItemsUseCase } from '@stardust/core/shop/use-cases'
import type { FirstTierReachedEvent } from '@stardust/core/ranking/events'

type Payload = EventPayload<typeof FirstTierReachedEvent>

export class AcquireDefaultShopItemsJob implements Job<Payload> {
  static readonly KEY = 'shop/acquire.default.shop.items.job'

  constructor(
    private readonly rocketsRepository: RocketsRepository,
    private readonly avatarsRepository: AvatarsRepository,
    private readonly broker: Broker,
    private readonly database: Database,
  ) {}

  async handle(amqp: Amqp<Payload>) {
    const { user, firstUnlockedStarId, firstReachedTierId } = amqp.getPayload()
    const useCase = this.createAcquireDefaultShopItemsUseCase()
    await amqp.run(
      async () => useCase.execute({ user, firstUnlockedStarId, firstReachedTierId }),
      AcquireDefaultShopItemsUseCase.name,
    )
  }

  private createAcquireDefaultShopItemsUseCase() {
    return new AcquireDefaultShopItemsUseCase(
      this.database,
      this.rocketsRepository,
      this.avatarsRepository,
      this.broker,
    )
  }
}
