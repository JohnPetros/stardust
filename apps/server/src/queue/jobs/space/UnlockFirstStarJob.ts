import type { Database } from '@stardust/core/global/interfaces'
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
    private readonly database: Database,
  ) {}

  async handle(amqp: Amqp<Payload>) {
    const payload = amqp.getPayload()
    const useCase = this.createUnlockFirstStarUseCase()

    await amqp.run(
      () => useCase.execute(this.userInput(payload)),
      UnlockFirstStarUseCase.name,
    )
  }

  private userInput(payload: Payload) {
    return {
      userId: payload.accountId,
      userName: payload.accountName,
      userEmail: payload.accountEmail,
    }
  }

  private createUnlockFirstStarUseCase() {
    return new UnlockFirstStarUseCase(this.database, this.planetsRepository, this.broker)
  }
}
