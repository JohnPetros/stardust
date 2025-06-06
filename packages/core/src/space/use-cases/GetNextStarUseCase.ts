import type { UseCase } from '#global/interfaces/UseCase'
import type { PlanetsRepository, StarsRepository } from '../interfaces'
import type { StarDto } from '../domain/entities/dtos/index'
import type { Star } from '../domain/entities'
import { Id } from '#global/domain/structures/Id'
import { PlanetNotFoundError, StarNotFoundError } from '../domain/errors'

type Request = {
  currentStarId: string
}

type Response = Promise<StarDto | null>

export class GetNextStarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly starsRepository: StarsRepository,
    private readonly planetsRepository: PlanetsRepository,
  ) {}

  async execute({ currentStarId }: Request): Response {
    const currentStar = await this.findCurrentStar(Id.create(currentStarId))
    const currentPlanet = await this.findCurrentPlanet(currentStar)
    let nextStar = currentPlanet.getNextStar(currentStar)

    if (!nextStar) {
      const nextPlanetPosition = currentPlanet.position.increment()
      const nextPlanet = await this.planetsRepository.findByPosition(nextPlanetPosition)

      if (nextPlanet) {
        nextStar = nextPlanet.firstStar
      }
    }

    return nextStar ? nextStar.dto : null
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
}
