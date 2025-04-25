import type { Job, ProfileService, Amqp } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { FirstTierReachedEvent } from '@stardust/core/ranking/events'
import { UserCreatedEvent } from '@stardust/core/profile/events'
import { CreateUserUseCase } from '@stardust/core/global/use-cases'

type Payload = EventPayload<typeof FirstTierReachedEvent>

export const HandleFirstTierReachedJob = (service: ProfileService): Job<Payload> => {
  return {
    async handle(queue: Amqp<Payload>) {
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
