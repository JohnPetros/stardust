import type { PlanetsRepository } from '@stardust/core/space/interfaces'
import type { EventBroker } from '@stardust/core/global/interfaces'
import type { Job, Amqp } from '@stardust/core/global/interfaces'
import { HandleStarsNewOrderUseCase } from '@stardust/core/space/use-cases'

export class HandleStarsNewOrderJob implements Job {
  static readonly KEY = 'space/handle.stars.new.order.job'

  constructor(
    private readonly repository: PlanetsRepository,
    private readonly eventBroker: EventBroker,
  ) {}

  async handle(amqp: Amqp) {
    const useCase = new HandleStarsNewOrderUseCase(this.repository, this.eventBroker)
    await amqp.run(async () => await useCase.execute(), HandleStarsNewOrderUseCase.name)
  }
}
