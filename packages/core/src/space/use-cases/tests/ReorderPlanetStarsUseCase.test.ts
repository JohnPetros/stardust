import { mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'

import { ReorderPlanetStarsUseCase } from '../ReorderPlanetStarsUseCase'
import type { PlanetsRepository, StarsRepository } from '../../interfaces'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'
import { Id } from '#global/domain/structures/Id'

describe('Reorder Planet Stars Use Case', () => {
  let useCase: ReorderPlanetStarsUseCase
  let planetsRepository: jest.Mocked<PlanetsRepository>
  let starsRepository: jest.Mocked<StarsRepository>

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    starsRepository = mock<StarsRepository>()
    useCase = new ReorderPlanetStarsUseCase(planetsRepository, starsRepository)
  })

  it('should reorder the stars of a planet', async () => {
    const planet = PlanetsFaker.fake()
    planet.reorderStars = jest.fn()
    const stars = [...planet.stars]
    const reorderedStarIds = [stars[1].id.value, stars[0].id.value]

    planetsRepository.findById.mockResolvedValue(planet)
    starsRepository.replaceMany.mockResolvedValue()

    await useCase.execute({ planetId: planet.id.value, starIds: reorderedStarIds })

    expect(planet.reorderStars).toHaveBeenCalledWith(reorderedStarIds.map(Id.create))
    expect(planetsRepository.findById).toHaveBeenCalledWith(planet.id)
    expect(starsRepository.replaceMany).toHaveBeenCalledWith(
      expect.arrayContaining([stars[0], stars[1]]),
    )
  })

  it('should throw an error if the planet is not found', async () => {
    planetsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ planetId: faker.string.uuid(), starIds: [] }),
    ).rejects.toThrow(PlanetNotFoundError)
  })
})
