import { UserSignedUpEvent } from '@stardust/core/auth/events'
import type { IJob, IQueue, IRankingService } from '@stardust/core/interfaces'
import { GetFirstTierIdUseCase } from '@stardust/core/ranking/use-cases'
import { FirstTierReachedEvent } from '@stardust/core/ranking/events'

export const HandleUserSignedJob = (rankingService: IRankingService): IJob => {
  return {
    key: 'ranking/handle.user.signed.up',
    eventName: UserSignedUpEvent.name,
    async handle(queue: IQueue) {
      const useCase = new GetFirstTierIdUseCase(rankingService)
      const payload = await queue.run<ReturnType<typeof useCase.do>>(
        useCase,
        GetFirstTierIdUseCase.name,
      )

      await queue.publish(new FirstTierReachedEvent(payload))
    },
  }
}
