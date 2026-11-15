import type { UseCase } from '#global/interfaces/UseCase'
import type {
  GalaxiesRepository,
  PlanetsRepository,
  StarsRepository,
} from '../interfaces'
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

type Response = Promise<{ nextStar: StarDto | null; isFirstGalaxy: boolean }>

export class GetNextStarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly starsRepository: StarsRepository,
    private readonly planetsRepository: PlanetsRepository,
    private readonly galaxiesRepository: GalaxiesRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ userName, userSlug, currentStarId }: Request) {
    const currentStar = await this.findCurrentStar(Id.create(currentStarId))
    const currentPlanet = await this.findCurrentPlanet(currentStar)
    const nextStar =
      currentPlanet.getNextStar(currentStar) ??
      (await this.findFirstStarOfNextPlanet(currentPlanet, userName, userSlug))

    return {
      nextStar: nextStar ? nextStar.dto : null,
      isFirstGalaxy: await this.isFirstGalaxy(currentPlanet),
    }
  }

  private async findFirstStarOfNextPlanet(
    currentPlanet: Planet,
    userName: string,
    userSlug: string,
  ): Promise<Star | null> {
    const nextPlanet = await this.planetsRepository.findByPosition(
      currentPlanet.position.increment(),
      currentPlanet.galaxyId,
    )
    if (!nextPlanet) return null

    await this.broker.publish(
      new PlanetCompletedEvent({
        userSlug,
        userName,
        planetName: currentPlanet.name.value,
      }),
    )
    return nextPlanet.firstStar
  }

  private async isFirstGalaxy(currentPlanet: Planet) {
    const firstGalaxy = await this.galaxiesRepository.findFirst()
    if (!firstGalaxy) return false
    return firstGalaxy.id.value === currentPlanet.galaxyId.value
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
