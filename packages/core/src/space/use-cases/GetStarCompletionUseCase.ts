import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { IdsList } from '#global/domain/structures/IdsList'
import type {
  GalaxiesRepository,
  PlanetsRepository,
  StarsRepository,
} from '../interfaces'
import { PlanetNotFoundError, StarLockedError, StarNotFoundError } from '../domain/errors'
import type { Planet, Star } from '../domain/entities'
import { GalaxyTrail } from '../domain/structures'

type Request = {
  starId: string
  completedStarsIds: string[]
  openedPlanetsIds: string[]
}

type Response = Promise<{
  isLastGalaxyStar: boolean
  isFirstGalaxy: boolean
  isAlreadyCompleted: boolean
  completedPlanetName: string | null
}>

export class GetStarCompletionUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly starsRepository: StarsRepository,
    private readonly planetsRepository: PlanetsRepository,
    private readonly galaxiesRepository: GalaxiesRepository,
  ) {}

  async execute({ starId, completedStarsIds, openedPlanetsIds }: Request) {
    const star = await this.findStar(Id.create(starId))
    const planet = await this.findPlanet(star)
    const completedIds = IdsList.create(completedStarsIds)
    const trail = await this.createTrail(planet, completedIds, openedPlanetsIds)
    if (trail.canAccessStar(star.id).isFalse) throw new StarLockedError()

    return this.createResponse(star, planet, trail, completedIds)
  }

  private async createResponse(
    star: Star,
    planet: Planet,
    trail: GalaxyTrail,
    completedStarsIds: IdsList,
  ) {
    return {
      isAlreadyCompleted: completedStarsIds.includes(star.id).isTrue,
      isLastGalaxyStar: trail.isLastStar(star.id).isTrue,
      isFirstGalaxy: await this.isFirstGalaxy(planet.galaxyId),
      completedPlanetName: trail.isLastStarOfPlanet(star.id).isTrue
        ? planet.name.value
        : null,
    }
  }

  private async findStar(starId: Id) {
    const star = await this.starsRepository.findById(starId)
    if (!star) throw new StarNotFoundError()
    return star
  }

  private async findPlanet(star: Star) {
    const planet = await this.planetsRepository.findByStar(star.id)
    if (!planet) throw new PlanetNotFoundError()
    return planet
  }

  private async createTrail(
    planet: Planet,
    completedStarsIds: IdsList,
    openedPlanetsIds: string[],
  ) {
    const planets = await this.planetsRepository.findAllByGalaxy(planet.galaxyId)
    return GalaxyTrail.create({
      planets,
      completedStarsIds,
      openedPlanetsIds: IdsList.create(openedPlanetsIds),
    })
  }

  private async isFirstGalaxy(galaxyId: Id) {
    const firstGalaxy = await this.galaxiesRepository.findFirst()
    if (!firstGalaxy) return false
    return firstGalaxy.id.value === galaxyId.value
  }
}
