import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository, StarsRepository } from '../interfaces'
import type { StarDto } from '../domain/entities/dtos/index'
import type { Planet, Star } from '../domain/entities'
import type { Broker } from '#global/interfaces/Broker'
import { Id } from '#global/domain/structures/Id'
import { PlanetNotFoundError, StarNotFoundError } from '../domain/errors'
import { PlanetCompletedEvent } from '../domain/events'

type Request = {
  userName: string
  userSlug: string
  currentStarId: string
}

type Response = Promise<StarDto | null>

export class GetNextStarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly database: Database,
    private readonly starsRepository: StarsRepository,
    private readonly planetsRepository: PlanetsRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction(request: Request) {
    const currentStar = await this.findCurrentStar(Id.create(request.currentStarId))
    const currentPlanet = await this.findCurrentPlanet(currentStar)
    const nextStar = currentPlanet.getNextStar(currentStar)
    if (nextStar) return nextStar.dto
    return this.firstStarOfNextPlanet(currentPlanet, request)
  }

  private async firstStarOfNextPlanet(planet: Planet, request: Request) {
    const nextPlanet = await this.findNextPlanet(planet)
    if (!nextPlanet) return null
    const firstStar = nextPlanet.firstStar
    await this.publishCompletion(planet, request)
    return firstStar.dto
  }

  private async findCurrentStar(currentStarId: Id) {
    const currentStar = await this.starsRepository.findById(currentStarId)
    if (!currentStar) throw new StarNotFoundError()
    return currentStar
  }

  private async findCurrentPlanet(currentStar: Star) {
    const currentPlanet = await this.planetsRepository.findByStar(currentStar.id)
    if (!currentPlanet) throw new PlanetNotFoundError()
    return currentPlanet
  }
  private publishCompletion(planet: Planet, request: Request) {
    return this.broker.publish(
      new PlanetCompletedEvent({
        userSlug: request.userSlug,
        userName: request.userName,
        planetName: planet.name.value,
      }),
    )
  }
  private findNextPlanet(planet: Planet) {
    return this.planetsRepository.findByPosition(planet.position.increment())
  }
}
