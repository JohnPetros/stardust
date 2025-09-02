import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { EventBroker } from '#global/interfaces/EventBroker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { TiersRepository } from '../interfaces'
import { FirstTierReachedEvent } from '../domain/events'
import { TierNotFoundError } from '../domain/errors'

type Request = {
  user: {
    id: string
    name: string
    email: string
    accountProvider: string
  }
  firstStarId: string
}

export class ReachFirstTierUseCase implements UseCase<Request, void> {
  constructor(
    private readonly repository: TiersRepository,
    private readonly eventBroker: EventBroker,
  ) {}

  async execute({ user, firstStarId }: Request) {
    const tier = await this.repository.findByPosition(OrdinalNumber.create(1))
    if (!tier) {
      throw new TierNotFoundError()
    }

    const event = new FirstTierReachedEvent({
      user,
      firstTierId: tier.id.value,
      firstStarId: firstStarId,
    })
    await this.eventBroker.publish(event)
  }
}
