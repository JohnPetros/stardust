import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { RankingWinnersDefinedEvent } from '@stardust/core/ranking/events'
import { UpdateTierUseCase } from '@stardust/core/profile/use-cases'

type Payload = EventPayload<typeof RankingWinnersDefinedEvent>

export class UpdateTierForRankingWinnersJob implements Job<Payload> {
  static readonly KEY = 'profile/update.tier.for.ranking.winners.job'

  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(amqp: Amqp<Payload>) {
    const { tierId, winnersIds } = amqp.getPayload()
    const useCase = new UpdateTierUseCase(this.usersRepository)
    await useCase.execute({ tierId, usersIds: winnersIds })
  }
}
