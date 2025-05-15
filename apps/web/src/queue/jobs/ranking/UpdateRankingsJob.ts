import type { Job, Amqp } from '@stardust/core/global/interfaces'
import type { RankingService } from '@stardust/core/ranking/interfaces'
import { UpdateRankingsUseCase } from '@stardust/core/ranking/use-cases'

export const UpdateRankingsJob = (service: RankingService): Job => {
  return {
    async handle(queue: Amqp) {
      const useCase = new UpdateRankingsUseCase(service)
      await queue.run(async () => useCase.execute(), UpdateRankingsUseCase.name)
    },
  }
}
