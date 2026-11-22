import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { IdsList } from '#global/domain/structures/IdsList'
import type { PlanetsRepository } from '../interfaces'
import { PlanetLockedError, PlanetNotFoundError } from '../domain/errors'
import { GalaxyTrail } from '../domain/structures'

type Request = {
  planetId: string
  completedStarsIds: string[]
  openedPlanetsIds: string[]
}

type Response = Promise<{ planetId: string; isAlreadyOpened: boolean }>

export class GetPlanetOpeningUseCase implements UseCase<Request, Response> {
  constructor(private readonly planetsRepository: PlanetsRepository) {}

  async execute({ planetId, completedStarsIds, openedPlanetsIds }: Request) {
    const planet = await this.planetsRepository.findById(Id.create(planetId))
    if (!planet) throw new PlanetNotFoundError()

    const planets = await this.planetsRepository.findAllByGalaxy(planet.galaxyId)
    const trail = GalaxyTrail.create({
      planets,
      completedStarsIds: IdsList.create(completedStarsIds),
      openedPlanetsIds: IdsList.create(openedPlanetsIds),
    })
    const state = trail.getPlanetState(planet.id)
    if (state.isLocked.isTrue) throw new PlanetLockedError()

    return { planetId: planet.id.value, isAlreadyOpened: state.isOpened.isTrue }
  }
}
