import type { IJob, IProfileService, IQueue } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { FirstTierReachedEvent } from '@stardust/core/ranking/events'
import { UserCreatedEvent } from '@stardust/core/profile/events'
import { CreateUserUseCase } from '@stardust/core/global/use-cases'

type Payload = EventPayload<typeof FirstTierReachedEvent>

export const HandleFirstTierReachedJob = (service: IProfileService): IJob<Payload> => {
  return {
    async handle(queue: IQueue<Payload>) {
      const { user, selectedAvatarByDefaultId, selectedRocketByDefaultId, firstTierId } =
        queue.getPayload()
      const useCase = new CreateUserUseCase(service)

      await queue.run(
        async () =>
          await useCase.do({
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            selectedAvatarByDefaultId,
            selectedRocketByDefaultId,
            firstTierId,
          }),
        CreateUserUseCase.name,
      )

      const event = new UserCreatedEvent({ userId: user.id })
      await queue.publish(event)
    },
  }
}
