import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { RankingLosersDefinedEvent } from '@stardust/core/ranking/events'
import { UpdateTierUseCase } from '@stardust/core/profile/use-cases'

type Payload = EventPayload<typeof RankingLosersDefinedEvent>

export class UpdateTierForRankingLosersJob implements Job<Payload> {
  static readonly KEY = 'profile/update.tier.for.ranking.losers.job'

  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(amqp: Amqp<Payload>) {
    const { tierId, losersIds } = amqp.getPayload()
    const useCase = new UpdateTierUseCase(this.usersRepository)
    await useCase.execute({ tierId, usersIds: losersIds })
  }
}
