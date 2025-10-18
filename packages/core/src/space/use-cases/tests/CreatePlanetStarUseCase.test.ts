import { mock } from 'ts-jest-mocker'
import { CreatePlanetStarUseCase } from '../CreatePlanetStarUseCase'
import type { PlanetsRepository, StarsRepository } from '../../interfaces'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'
import { faker } from '@faker-js/faker'

describe('Create Planet Star Use Case', () => {
  let useCase: CreatePlanetStarUseCase
  let planetsRepository: jest.Mocked<PlanetsRepository>
  let starsRepository: jest.Mocked<StarsRepository>

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    starsRepository = mock<StarsRepository>()
    useCase = new CreatePlanetStarUseCase(planetsRepository, starsRepository)
  })

  it('should create a new star for a planet', async () => {
    const planet = PlanetsFaker.fake()
    planetsRepository.findById.mockResolvedValue(planet)
    starsRepository.add.mockResolvedValue()
    const result = await useCase.execute({ planetId: planet.id.value })

    expect(planetsRepository.findById).toHaveBeenCalledWith(planet.id)
    expect(starsRepository.add).toHaveBeenCalledWith(planet.lastStar, planet.id)
    expect(result).toEqual(planet.lastStar.dto)
  })

  it('should throw an error if the planet is not found', async () => {
    planetsRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ planetId: faker.string.uuid() })).rejects.toThrow(
      PlanetNotFoundError,
    )
  })
})
