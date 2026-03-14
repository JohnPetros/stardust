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
    private readonly repository: TiersRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ user, firstUnlockedStarId }: Request) {
    const tier = await this.repository.findByPosition(OrdinalNumber.create(1))
    if (!tier) {
      throw new TierNotFoundError()
    }

    console.log('tier.id', tier.id.value)

    const event = new FirstTierReachedEvent({
      user,
      firstReachedTierId: tier.id.value,
      firstUnlockedStarId,
    })
    await this.broker.publish(event)
  }
}
