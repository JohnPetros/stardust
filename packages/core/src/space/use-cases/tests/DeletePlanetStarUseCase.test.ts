import { mock } from 'ts-jest-mocker'
import { DeletePlanetStarUseCase } from '../DeletePlanetStarUseCase'
import type { PlanetsRepository, StarsRepository } from '../../interfaces'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'
import { faker } from '@faker-js/faker'

describe('DeletePlanetStarUseCase', () => {
  let useCase: DeletePlanetStarUseCase
  let planetsRepository: jest.Mocked<PlanetsRepository>
  let starsRepository: jest.Mocked<StarsRepository>

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    starsRepository = mock<StarsRepository>()
    useCase = new DeletePlanetStarUseCase(planetsRepository, starsRepository)
  })

  it('should delete a star from a planet', async () => {
    const planet = PlanetsFaker.fake()
    const star = planet.stars[0]
    planet.removeStar = jest.fn()
    planetsRepository.findById.mockResolvedValue(planet)
    starsRepository.remove.mockResolvedValue()
    starsRepository.replaceMany.mockResolvedValue()

    await useCase.execute({ planetId: planet.id.value, starId: star.id.value })

    expect(planet.removeStar).toHaveBeenCalledWith(star.id)
    expect(planetsRepository.findById).toHaveBeenCalledWith(planet.id)
    expect(starsRepository.remove).toHaveBeenCalledWith(star.id)
    expect(starsRepository.replaceMany).toHaveBeenCalledWith(planet.stars)
  })

  it('should throw an error if the planet is not found', async () => {
    planetsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ planetId: faker.string.uuid(), starId: faker.string.uuid() }),
    ).rejects.toThrow(PlanetNotFoundError)
  })
})
