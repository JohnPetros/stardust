import type { IJob, IQueue, IRankingService } from '@stardust/core/interfaces'
import { GetFirstTierIdUseCase } from '@stardust/core/ranking/use-cases'
import { FirstTierReachedEvent } from '@stardust/core/ranking/events'

export const HandleUserSignedUpJob = (rankingService: IRankingService): IJob => {
  return {
    async handle(queue: IQueue) {
      await queue.sleepFor('1s')

      const useCase = new GetFirstTierIdUseCase(rankingService)
      const { firstTierId } = await queue.run<ReturnType<typeof useCase.do>>(
        async () => useCase.do(),
        GetFirstTierIdUseCase.name,
      )

      const event = new FirstTierReachedEvent({ firstTierId })
      await queue.sleepFor('3s')
      await queue.publish(event)
    },
  }
}
