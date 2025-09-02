import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import type { EventBroker } from '@stardust/core/global/interfaces'
import type { Job, Amqp } from '@stardust/core/global/interfaces'
import { UnlockFirstStarUseCase } from '@stardust/core/space/use-cases'
import type { UserSignedUpEvent } from '@stardust/core/auth/events'
import type { EventPayload } from '@stardust/core/global/types'

type Payload = EventPayload<typeof UserSignedUpEvent>

export class UnlockFirstStarJob implements Job<Payload> {
  static readonly KEY = 'space/unlock.first.star.job'

  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly eventBroker: EventBroker,
  ) {}

  async handle(amqp: Amqp<Payload>) {
    const payload = amqp.getPayload()
    const useCase = new UnlockFirstStarUseCase(this.planetsRepository, this.eventBroker)

    await amqp.run(
      async () =>
        await useCase.execute({
          userId: payload.userId,
          userName: payload.userName,
          userEmail: payload.userEmail,
          userAccountProvider: payload.userAccountProvider,
        }),
      UnlockFirstStarUseCase.name,
    )
  }
}
