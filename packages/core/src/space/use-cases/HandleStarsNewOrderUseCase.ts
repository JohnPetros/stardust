import type { Broker } from '#global/interfaces/Broker'
import type { UseCase } from '#global/interfaces/UseCase'
import type { GalaxiesRepository, PlanetsRepository } from '../interfaces'
import { GalaxyNotFoundError } from '../domain/errors'
import { SpaceOrderChangedEvent } from '../domain/events'

export class HandleStarsNewOrderUseCase implements UseCase {
  constructor(
    private readonly repository: PlanetsRepository,
    private readonly galaxiesRepository: GalaxiesRepository,
    private readonly broker: Broker,
  ) {}

  async execute(): Promise<void> {
    const galaxy = await this.galaxiesRepository.findFirst()
    if (!galaxy) throw new GalaxyNotFoundError()

    const planets = await this.repository.findAllByGalaxy(galaxy.id)
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
