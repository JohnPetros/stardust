import type { IJob, IQueue, IRankingService } from '@stardust/core/interfaces'
import { UpdateRankingsUseCase } from '@stardust/core/ranking/use-cases'

export const UpdateRankingsJob = (rankingService: IRankingService): IJob => {
  return {
    async handle(queue: IQueue) {
      const useCase = new UpdateRankingsUseCase(rankingService)
      await queue.run(async () => useCase.do(), UpdateRankingsUseCase.name)
    },
  }
}
