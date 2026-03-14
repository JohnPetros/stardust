import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import type { Broker } from '@stardust/core/global/interfaces'
import type { Job, Amqp } from '@stardust/core/global/interfaces'
import { UnlockFirstStarUseCase } from '@stardust/core/space/use-cases'
import type { AccountSignedUpEvent } from '@stardust/core/auth/events'
import type { EventPayload } from '@stardust/core/global/types'

type Payload = EventPayload<typeof AccountSignedUpEvent>

export class UnlockFirstStarJob implements Job<Payload> {
  static readonly KEY = 'space/unlock.first.star.job'

  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly broker: Broker,
  ) {}

  async handle(amqp: Amqp<Payload>) {
    const payload = amqp.getPayload()
    console.log({ payload })
    const useCase = new UnlockFirstStarUseCase(this.planetsRepository, this.broker)

    await amqp.run(
      async () =>
        await useCase.execute({
          userId: payload.accountId,
          userName: payload.accountName,
          userEmail: payload.accountEmail,
        }),
      UnlockFirstStarUseCase.name,
    )
  }
}
