import type { IJob, IQueue, ISpaceService } from '@stardust/core/global/interfaces'
import { GetFirstStarIdUseCase, UnlockStarUseCase } from '@stardust/core/space/use-cases'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'
import { UserCreatedEvent } from '@stardust/core/profile/events'

type UserCreatedPayload = ConstructorParameters<typeof UserCreatedEvent>['0']

type Payload = {
  userId: string
  userName: string
  userEmail: string
}

export const HandleUserSignedUpJob = (spaceService: ISpaceService): IJob => {
  return {
    async handle(queue: IQueue<Payload>) {
      const getFirstStarIdUseCase = new GetFirstStarIdUseCase(spaceService)

      const { firstUnlockedStarId } = await queue.run<
        ReturnType<typeof getFirstStarIdUseCase.do>
      >(async () => await getFirstStarIdUseCase.do(), GetFirstStarIdUseCase.name)
      const payload = queue.getPayload()

      const event = new FirstStarUnlockedEvent({
        user: {
          id: payload.userId,
          name: payload.userName,
          email: payload.userEmail,
        },
        firstUnlockedStarId,
      })

      await queue.publish(event)

      const { userId } = await queue.waitFor<UserCreatedPayload>(
        UserCreatedEvent.NAME,
        '20s',
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
