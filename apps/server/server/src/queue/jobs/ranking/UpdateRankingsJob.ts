import type { Job, Amqp, EventBroker } from '@stardust/core/global/interfaces'
import type {
  RankersRepository,
  TiersRepository,
} from '@stardust/core/ranking/interfaces'
import { UpdateRankingsUseCase } from '@stardust/core/ranking/use-cases'

export class UpdateRankingsJob implements Job {
  static readonly KEY = 'ranking/update.rankings.job'
  static readonly cronExpression = 'TZ=America/Sao_Paulo 0 0 * * *'

  constructor(
    private readonly tiersRepository: TiersRepository,
    private readonly rankersRepository: RankersRepository,
    private readonly eventBroker: EventBroker,
  ) {}

  async handle(amqp: Amqp) {
    const useCase = new UpdateRankingsUseCase(
      this.tiersRepository,
      this.rankersRepository,
      this.eventBroker,
    )
    await amqp.run(async () => useCase.execute(), UpdateRankingsUseCase.name)
  }
}
