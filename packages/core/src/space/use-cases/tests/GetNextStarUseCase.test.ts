import { mock, type Mock } from 'ts-jest-mocker'

import type {
  StarsRepository,
  PlanetsRepository,
  GalaxiesRepository,
} from '#space/interfaces/index'
import type { Broker } from '#global/interfaces/Broker'
import { GetNextStarUseCase } from '../GetNextStarUseCase'
import { StarNotFoundError } from '#space/domain/errors/StarNotFoundError'
import { Id } from '#global/domain/structures/Id'
import { StarsFaker } from '#space/domain/entities/tests/fakers/StarsFaker'
import { PlanetNotFoundError } from '#space/domain/errors/PlanetNotFoundError'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'
import { GalaxiesFaker } from '#space/domain/entities/fakers/GalaxiesFaker'
import { PlanetCompletedEvent } from '#space/domain/events/PlanetCompletedEvent'

describe('Get Next Star Use Case', () => {
  let starsRepository: Mock<StarsRepository>
  let planetsRepository: Mock<PlanetsRepository>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let Broker: Mock<Broker>
  let useCase: GetNextStarUseCase
  const userName = 'John Doe'
  const userSlug = 'john-doe'
  const firstGalaxy = GalaxiesFaker.fake({ position: 1 })

  beforeEach(() => {
    starsRepository = mock<StarsRepository>()
    planetsRepository = mock<PlanetsRepository>()
    galaxiesRepository = mock<GalaxiesRepository>()
    Broker = mock<Broker>()
    Broker.publish.mockImplementation()
    starsRepository.findById.mockImplementation()
    planetsRepository.findByStar.mockImplementation()
    planetsRepository.findByPosition.mockImplementation()
    galaxiesRepository.findFirst.mockResolvedValue(firstGalaxy)
    useCase = new GetNextStarUseCase(
      starsRepository,
      planetsRepository,
      galaxiesRepository,
      Broker,
    )
  })

  it('should throw an error if the current star is not found', async () => {
    starsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ currentStarId: Id.create().value, userName, userSlug }),
    ).rejects.toThrow(StarNotFoundError)
  })

  it('should throw an error if the current planet is not found', async () => {
    const star = StarsFaker.fake()
    starsRepository.findById.mockResolvedValue(star)
    planetsRepository.findByStar.mockResolvedValue(null)

    await expect(
      useCase.execute({ currentStarId: star.id.value, userName, userSlug }),
    ).rejects.toThrow(PlanetNotFoundError)
  })

  it('should try to find the next planet inside the galaxy of the current planet if the current star is the last one of the current planet', async () => {
    const star = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [star.dto] })
    starsRepository.findById.mockResolvedValue(star)
    planetsRepository.findByStar.mockResolvedValue(planet)

    await useCase.execute({ currentStarId: star.id.value, userName, userSlug })

    expect(planetsRepository.findByPosition).toHaveBeenCalledWith(
      planet.position.increment(),
      planet.galaxyId,
    )
  })

  it('should return the next star of the current planet', async () => {
    const currentStar = StarsFaker.fake({ number: 1 })
    const nextStar = StarsFaker.fake({ number: 2 })
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto, nextStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(response.nextStar).toEqual(nextStar.dto)
    expect(planetsRepository.findByPosition).not.toHaveBeenCalled()
  })

  it('should return the first star of the next planet if the current star is the last one of the current planet', async () => {
    const currentStar = StarsFaker.fake()
    const nextStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto] })
    const nextPlanet = PlanetsFaker.fake({
      galaxyId: planet.galaxyId.value,
      stars: [nextStar.dto],
    })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)
    planetsRepository.findByPosition.mockResolvedValue(nextPlanet)

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(planetsRepository.findByPosition).toHaveBeenCalledWith(
      planet.position.increment(),
      planet.galaxyId,
    )
    expect(response.nextStar).toEqual(nextStar.dto)
  })

  it('should publish an event when the current planet is completed', async () => {
    const currentStar = StarsFaker.fake()
    const nextStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto] })
    const nextPlanet = PlanetsFaker.fake({ stars: [nextStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)
    planetsRepository.findByPosition.mockResolvedValue(nextPlanet)

    await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(Broker.publish).toHaveBeenCalledWith(
      new PlanetCompletedEvent({
        userSlug,
        userName,
        planetName: planet.name.value,
      }),
    )
  })

  it('should return a null next star if no next star is found', async () => {
    const currentStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(response.nextStar).toBeNull()
    expect(Broker.publish).not.toHaveBeenCalled()
  })

  it('should return a null next star at the end of a galaxy even if another galaxy has a planet in the next position', async () => {
    const otherGalaxy = GalaxiesFaker.fake({ position: 2 })
    const currentStar = StarsFaker.fake()
    const lastPlanetOfGalaxy = PlanetsFaker.fake({
      galaxyId: otherGalaxy.id.value,
      position: 3,
      stars: [currentStar.dto],
    })
    const planetOfAnotherGalaxy = PlanetsFaker.fake({
      galaxyId: firstGalaxy.id.value,
      position: 4,
    })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(lastPlanetOfGalaxy)
    planetsRepository.findByPosition.mockImplementation(async (position, galaxyId) =>
      position.value === planetOfAnotherGalaxy.position.value &&
      galaxyId.value === planetOfAnotherGalaxy.galaxyId.value
        ? planetOfAnotherGalaxy
        : null,
    )

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(planetsRepository.findByPosition).toHaveBeenCalledWith(
      lastPlanetOfGalaxy.position.increment(),
      otherGalaxy.id,
    )
    expect(response.nextStar).toBeNull()
    expect(Broker.publish).not.toHaveBeenCalled()
  })

  it('should keep going to the next planet of the same galaxy when both galaxies share positions', async () => {
    const otherGalaxy = GalaxiesFaker.fake({ position: 2 })
    const currentStar = StarsFaker.fake()
    const nextStar = StarsFaker.fake()
    const currentPlanet = PlanetsFaker.fake({
      galaxyId: otherGalaxy.id.value,
      position: 1,
      stars: [currentStar.dto],
    })
    const nextPlanet = PlanetsFaker.fake({
      galaxyId: otherGalaxy.id.value,
      position: 2,
      stars: [nextStar.dto],
    })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(currentPlanet)
    planetsRepository.findByPosition.mockImplementation(async (position, galaxyId) =>
      position.value === 2 && galaxyId.value === otherGalaxy.id.value ? nextPlanet : null,
    )

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(response.nextStar).toEqual(nextStar.dto)
  })

  it('should indicate that the current planet belongs to the first galaxy', async () => {
    const currentStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({
      galaxyId: firstGalaxy.id.value,
      stars: [currentStar.dto],
    })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(response.isFirstGalaxy).toBe(true)
  })

  it('should indicate that the current planet does not belong to the first galaxy', async () => {
    const currentStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({
      galaxyId: GalaxiesFaker.fake({ position: 2 }).id.value,
      stars: [currentStar.dto],
    })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(response.isFirstGalaxy).toBe(false)
  })

  it('should not indicate the first galaxy when the catalog has no galaxy', async () => {
    const currentStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)
    galaxiesRepository.findFirst.mockResolvedValue(null)

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(response.isFirstGalaxy).toBe(false)
  })
})
