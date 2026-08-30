import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { RankingUpdatedEvent } from '@stardust/core/ranking/events'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UpdateRankingPositionsUseCase } from '@stardust/core/profile/use-cases'

type Payload = EventPayload<typeof RankingUpdatedEvent>

export class UpdateRankingPositionsJob implements Job<Payload> {
  static readonly KEY = 'profile/update.ranking.positions.job'

  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(amqp: Amqp<Payload>) {
    const { tierId } = amqp.getPayload()
    const useCase = new UpdateRankingPositionsUseCase(this.usersRepository)
    useCase.execute(tierId)
  }
}
