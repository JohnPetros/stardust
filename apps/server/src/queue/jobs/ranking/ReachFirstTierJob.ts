import type { Job, Amqp, Broker } from '@stardust/core/global/interfaces'
import { ReachFirstTierUseCase } from '@stardust/core/ranking/use-cases'
import type { EventPayload } from '@stardust/core/global/types'
import type { TiersRepository } from '@stardust/core/ranking/interfaces'
import type { FirstStarUnlockedEvent } from '@stardust/core/space/events'

type Payload = EventPayload<typeof FirstStarUnlockedEvent>

export class ReachFirstTierJob implements Job<Payload> {
  static readonly KEY = 'ranking/reach.first.tier.job'

  constructor(
    private readonly tiersRepository: TiersRepository,
    private readonly broker: Broker,
  ) {}

  async handle(amqp: Amqp<Payload>) {
    const payload = amqp.getPayload()
    const useCase = new ReachFirstTierUseCase(this.tiersRepository, this.broker)
    await amqp.run(async () => useCase.execute(payload), ReachFirstTierUseCase.name)
  }
}
