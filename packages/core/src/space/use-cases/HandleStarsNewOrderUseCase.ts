import type { Database } from '#global/interfaces/Database'
import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository } from '../interfaces'
import { SpaceOrderChangedEvent } from '../domain/events'

export class HandleStarsNewOrderUseCase implements UseCase {
  constructor(
    private readonly database: Database,
    private readonly repository: PlanetsRepository,
    private readonly broker: Broker,
  ) {}

  async execute() {
    return this.database.run(() => this.updateInTransaction())
  }

  private async updateInTransaction() {
    const planets = await this.repository.findAll()
    const reorderedStarIds = planets.flatMap((planet) =>
      planet.stars.map((star) => star.id.value),
    )
    await this.broker.publish(new SpaceOrderChangedEvent({ reorderedStarIds }))
  }
}
