import type { Database } from '#global/interfaces/Database'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { TiersRepository } from '../interfaces'
import { FirstTierReachedEvent } from '../domain/events'
import { TierNotFoundError } from '../domain/errors'

type Request = {
  user: {
    id: string
    name: string
    email: string
  }
  firstUnlockedStarId: string
}

export class ReachFirstTierUseCase implements UseCase<Request, void> {
  constructor(
    private readonly database: Database,
    private readonly repository: TiersRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction({ user, firstUnlockedStarId }: Request) {
    const tier = await this.findFirstTier()

    await this.publishFirstTier(user, firstUnlockedStarId, tier.id.value)
  }
  private async findFirstTier() {
    const tier = await this.repository.findByPosition(OrdinalNumber.create(1))
    if (!tier) throw new TierNotFoundError()
    return tier
  }
  private publishFirstTier(
    user: Request['user'],
    firstUnlockedStarId: string,
    firstReachedTierId: string,
  ) {
    return this.broker.publish(
      new FirstTierReachedEvent({ user, firstReachedTierId, firstUnlockedStarId }),
    )
  }
}
