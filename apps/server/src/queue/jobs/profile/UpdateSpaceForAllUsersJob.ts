import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { SpaceOrderChangedEvent } from '@stardust/core/space/events'
import type { EventPayload } from '@stardust/core/global/types'
import { UpdateSpaceForAllUsersUseCase } from '@stardust/core/profile/use-cases'

type Payload = EventPayload<typeof SpaceOrderChangedEvent>

export class UpdateSpaceForAllUsersJob implements Job<Payload> {
  static readonly KEY = 'profile/update.space.for.all.users.job'

  constructor(private readonly repository: UsersRepository) {}

  async handle(amqp: Amqp<Payload>) {
    const { reorderedStarIds } = amqp.getPayload()
    const useCase = new UpdateSpaceForAllUsersUseCase(this.repository)
    await amqp.run(
      async () => await useCase.execute({ reorderedStarIds }),
      UpdateSpaceForAllUsersUseCase.name,
    )
  }
}
