import type { EventBroker } from '#global/interfaces/EventBroker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository } from '../interfaces'
import { SpaceOrderChangedEvent } from '../domain/events'

export class HandleStarsNewOrderUseCase implements UseCase {
  constructor(
    private readonly repository: PlanetsRepository,
    private readonly broker: EventBroker,
  ) {}

  async execute(): Promise<void> {
    const planets = await this.repository.findAll()
    const starsId: string[] = []

    for (const planet of planets) {
      starsId.push(...planet.stars.map((star) => star.id.value))
    }

    const event = new SpaceOrderChangedEvent({
      reorderedStarIds: starsId,
    })
    await this.broker.publish(event)
  }
}
