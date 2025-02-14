import type { IJob, IQueue, ISpaceService } from '@stardust/core/interfaces'
import { GetFirstStarIdUseCase, UnlockStarUseCase } from '@stardust/core/space/use-cases'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'
import { UserCreatedEvent } from '@stardust/core/profile/events'

type UserCreatedPayload = ConstructorParameters<typeof UserCreatedEvent>['0']

export const HandleUserSignedUpJob = (spaceService: ISpaceService): IJob => {
  return {
    async handle(queue: IQueue) {
      queue.sleepFor('1s')

      const getFirstStarIdUseCase = new GetFirstStarIdUseCase(spaceService)

      const { firstUnlockedStarId } = await queue.run<
        ReturnType<typeof getFirstStarIdUseCase.do>
      >(async () => await getFirstStarIdUseCase.do(), GetFirstStarIdUseCase.name)

      const event = new FirstStarUnlockedEvent({
        firstUnlockedStarId,
      })

      await queue.publish(event)

      const { userId } = await queue.waitFor<UserCreatedPayload>(
        UserCreatedEvent.NAME,
        '1h',
      )

      if (userId)
        await queue.run(async () => {
          const useCase = new UnlockStarUseCase(spaceService)
          await useCase.do({
            userId: userId,
            starId: firstUnlockedStarId,
          })
        }, UnlockStarUseCase.name)
    },
  }
}

/**
 * {
  "name": "auth/user.signed.up",
  "data": {
    "userId": "5b2c0713-0ede-43d9-9249-e73c976609d5",
    "userName": "Jonas",
    "userEmail": "joaoppedro.nc@outlook.com"
  },
  "user": {}
}
 */
