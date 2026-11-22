import { mock, type Mock } from 'ts-jest-mocker'

import type {
  GalaxiesRepository,
  PlanetsRepository,
  StarsRepository,
} from '#space/interfaces/index'
import { Id } from '#global/domain/structures/Id'
import { StarNotFoundError } from '#space/domain/errors/StarNotFoundError'
import { PlanetNotFoundError } from '#space/domain/errors/PlanetNotFoundError'
import { StarLockedError } from '#space/domain/errors/StarLockedError'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'
import { StarsFaker } from '#space/domain/entities/tests/fakers/StarsFaker'
import { GalaxiesFaker } from '#space/domain/entities/fakers/GalaxiesFaker'
import { GetStarCompletionUseCase } from '../GetStarCompletionUseCase'

describe('Get Star Completion Use Case', () => {
  let starsRepository: Mock<StarsRepository>
  let planetsRepository: Mock<PlanetsRepository>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let useCase: GetStarCompletionUseCase

  const firstGalaxy = GalaxiesFaker.fake({ position: 1 })
  const firstPlanet = PlanetsFaker.fake({
    position: 1,
    galaxyId: firstGalaxy.id.value,
    stars: [1, 2, 3].map((number) => StarsFaker.fakeDto({ number })),
  })
  const secondPlanet = PlanetsFaker.fake({
    position: 2,
    galaxyId: firstGalaxy.id.value,
    stars: [1, 2].map((number) => StarsFaker.fakeDto({ number })),
  })
  const [first, second, third] = firstPlanet.stars
  const lastStar = secondPlanet.stars[1]

  beforeEach(() => {
    starsRepository = mock<StarsRepository>()
    planetsRepository = mock<PlanetsRepository>()
    galaxiesRepository = mock<GalaxiesRepository>()
    galaxiesRepository.findFirst.mockResolvedValue(firstGalaxy)
    planetsRepository.findAllByGalaxy.mockResolvedValue([firstPlanet, secondPlanet])
    planetsRepository.findByStar.mockResolvedValue(firstPlanet)
    useCase = new GetStarCompletionUseCase(
      starsRepository,
      planetsRepository,
      galaxiesRepository,
    )
  })

  it('should throw when the star does not exist', async () => {
    starsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        starId: Id.create().value,
        completedStarsIds: [],
        openedPlanetsIds: [],
      }),
    ).rejects.toThrow(StarNotFoundError)
  })

  it('should throw when the planet of the star does not exist', async () => {
    starsRepository.findById.mockResolvedValue(first)
    planetsRepository.findByStar.mockResolvedValue(null)

    await expect(
      useCase.execute({
        starId: first.id.value,
        completedStarsIds: [],
        openedPlanetsIds: [firstPlanet.id.value],
      }),
    ).rejects.toThrow(PlanetNotFoundError)
  })

  it('should throw StarLockedError for a locked star', async () => {
    starsRepository.findById.mockResolvedValue(second)

    await expect(
      useCase.execute({
        starId: second.id.value,
        completedStarsIds: [],
        openedPlanetsIds: [firstPlanet.id.value],
      }),
    ).rejects.toThrow(StarLockedError)
  })

  it('should throw StarLockedError when the planet is not opened', async () => {
    starsRepository.findById.mockResolvedValue(first)

    await expect(
      useCase.execute({
        starId: first.id.value,
        completedStarsIds: [],
        openedPlanetsIds: [],
      }),
    ).rejects.toThrow(StarLockedError)
  })

  it('should accept an available star', async () => {
    starsRepository.findById.mockResolvedValue(first)

    const response = await useCase.execute({
      starId: first.id.value,
      completedStarsIds: [],
      openedPlanetsIds: [firstPlanet.id.value],
    })

    expect(response).toEqual({
      isAlreadyCompleted: false,
      isLastGalaxyStar: false,
      isFirstGalaxy: true,
      completedPlanetName: null,
    })
  })

  it('should flag an already completed star', async () => {
    starsRepository.findById.mockResolvedValue(first)

    const response = await useCase.execute({
      starId: first.id.value,
      completedStarsIds: [first.id.value],
      openedPlanetsIds: [firstPlanet.id.value],
    })

    expect(response.isAlreadyCompleted).toBe(true)
  })

  it('should return the planet name for the last star of a planet', async () => {
    starsRepository.findById.mockResolvedValue(third)

    const response = await useCase.execute({
      starId: third.id.value,
      completedStarsIds: [first.id.value, second.id.value],
      openedPlanetsIds: [firstPlanet.id.value],
    })

    expect(response.completedPlanetName).toBe(firstPlanet.name.value)
    expect(response.isLastGalaxyStar).toBe(false)
  })

  it('should flag the last star of the galaxy and a galaxy that is not the first', async () => {
    starsRepository.findById.mockResolvedValue(lastStar)
    planetsRepository.findByStar.mockResolvedValue(secondPlanet)
    galaxiesRepository.findFirst.mockResolvedValue(GalaxiesFaker.fake({ position: 2 }))

    const response = await useCase.execute({
      starId: lastStar.id.value,
      completedStarsIds: [
        first.id.value,
        second.id.value,
        third.id.value,
        secondPlanet.stars[0].id.value,
      ],
      openedPlanetsIds: [firstPlanet.id.value, secondPlanet.id.value],
    })

    expect(response.isLastGalaxyStar).toBe(true)
    expect(response.isFirstGalaxy).toBe(false)
  })
})
