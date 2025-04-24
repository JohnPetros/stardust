import type { IJob, IQueue, IRankingService } from '@stardust/core/global/interfaces'
import { UpdateRankingsUseCase } from '@stardust/core/ranking/use-cases'

export const UpdateRankingsJob = (service: IRankingService): IJob => {
  return {
    async handle(queue: IQueue) {
      const useCase = new UpdateRankingsUseCase(service)
      await queue.run(async () => useCase.do(), UpdateRankingsUseCase.name)
    },
  }
}
