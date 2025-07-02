import { mock, type Mock } from 'ts-jest-mocker'

import type { StarsRepository, PlanetsRepository } from '#space/interfaces/index'
import { GetNextStarUseCase } from '../GetNextStarUseCase'
import { StarNotFoundError } from '#space/domain/errors/StarNotFoundError'
import { Id } from '#global/domain/structures/Id'
import { StarsFaker } from '#space/domain/entities/tests/fakers/StarsFaker'
import { PlanetNotFoundError } from '#space/domain/errors/PlanetNotFoundError'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'

describe('Get Next Star Use Case', () => {
  let starsRepository: Mock<StarsRepository>
  let planetsRepository: Mock<PlanetsRepository>
  let useCase: GetNextStarUseCase

  beforeEach(() => {
    starsRepository = mock<StarsRepository>()
    planetsRepository = mock<PlanetsRepository>()
    starsRepository.findById.mockImplementation()
    planetsRepository.findByStar.mockImplementation()
    planetsRepository.findByPosition.mockImplementation()
    useCase = new GetNextStarUseCase(starsRepository, planetsRepository)
  })

  it('should throw an error if the current star is not found', () => {
    starsRepository.findById.mockResolvedValue(null)

    expect(useCase.execute({ currentStarId: Id.create().value })).rejects.toThrow(
      StarNotFoundError,
    )
  })

  it('should throw an error if the current planet is not found', () => {
    const star = StarsFaker.fake()
    starsRepository.findById.mockResolvedValue(star)
    planetsRepository.findByStar.mockResolvedValue(null)

    expect(useCase.execute({ currentStarId: star.id.value })).rejects.toThrow(
      PlanetNotFoundError,
    )
  })

  it('should try to find the next star in the next planet if the current star is the last one of the current planet', async () => {
    const star = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [star.dto] })
    starsRepository.findById.mockResolvedValue(star)
    planetsRepository.findByStar.mockResolvedValue(planet)

    await useCase.execute({ currentStarId: star.id.value })

    expect(planetsRepository.findByPosition).toHaveBeenCalledWith(
      planet.position.increment(),
    )
  })

  it('should return the next star of the current planet', async () => {
    const currentStar = StarsFaker.fake({ number: 1 })
    const nextStar = StarsFaker.fake({ number: 2 })
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto, nextStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)

    const response = await useCase.execute({ currentStarId: currentStar.id.value })

    expect(response).toEqual(nextStar.dto)
  })

  it('should try to find the next star in the next planet if the current star is the last one of the current planet', async () => {
    const currentStar = StarsFaker.fake()
    const nextStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto] })
    const nextPlanet = PlanetsFaker.fake({ stars: [nextStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)
    planetsRepository.findByPosition.mockResolvedValue(nextPlanet)

    const response = await useCase.execute({ currentStarId: currentStar.id.value })

    expect(planetsRepository.findByPosition).toHaveBeenCalledWith(
      planet.position.increment(),
    )
    expect(response).toEqual(nextStar.dto)
  })

  it('should return null if no next star is found', async () => {
    const currentStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)

    const response = await useCase.execute({ currentStarId: currentStar.id.value })

    expect(response).toBeNull()
  })
})
