import { UserSignedUpEvent } from '@stardust/core/auth/events'
import type { IJob, IQueue, ISpaceService } from '@stardust/core/interfaces'
import { GetFirstStarIdUseCase } from '@stardust/core/space/use-cases'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'

export const HandleUserSignedJob = (spaceService: ISpaceService): IJob => {
  return {
    key: 'space/handle.user.signed.up',
    eventName: UserSignedUpEvent.name,
    async handle(queue: IQueue) {
      const useCase = new GetFirstStarIdUseCase(spaceService)

      const { firstUnlockedStarId } = await queue.run<ReturnType<typeof useCase.do>>(
        useCase,
        GetFirstStarIdUseCase.name,
      )

      const event = new FirstStarUnlockedEvent({
        firstUnlockedStarId,
      })
      await queue.publish(event)
    },
  }
}
