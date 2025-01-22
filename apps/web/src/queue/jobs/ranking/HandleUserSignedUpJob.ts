import { UserSignedUpEvent } from '@stardust/core/auth/events'
import type { IJob, IQueue, IRankingService } from '@stardust/core/interfaces'
import { GetFirstTierIdUseCase } from '@stardust/core/ranking/use-cases'
import { FirstTierReachedEvent } from '@stardust/core/ranking/events'

export const KEY = 'ranking/handle.user.signed.up'

export const HandleUserSignedUpJob = (rankingService: IRankingService): IJob => {
  return {
    key: 'ranking/handle.user.signed.up',
    eventName: UserSignedUpEvent.name,
    async handle(queue: IQueue) {
      queue.sleepFor('1s')

      const useCase = new GetFirstTierIdUseCase(rankingService)
      const { firstTierId } = await queue.run<ReturnType<typeof useCase.do>>(
        async () => useCase.do(),
        GetFirstTierIdUseCase.name,
      )

      const event = new FirstTierReachedEvent({ firstTierId })
      await queue.publish(event)
    },
  }
}
