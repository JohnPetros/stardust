import { mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'

import { ReorderPlanetsUseCase } from '../ReorderPlanetsUseCase'
import type { PlanetsRepository } from '../../interfaces'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'

describe('Reorder Planets Use Case', () => {
  let useCase: ReorderPlanetsUseCase
  let planetsRepository: jest.Mocked<PlanetsRepository>

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    useCase = new ReorderPlanetsUseCase(planetsRepository)
  })

  it('should reorder planets to match the provided id sequence', async () => {
    const planets = PlanetsFaker.fakeMany(3)
    const shuffledIds = [planets[2].id.value, planets[0].id.value, planets[1].id.value]

    planetsRepository.findAll.mockResolvedValue(planets)
    planetsRepository.replaceMany.mockResolvedValue()

    await useCase.execute({ planetIds: shuffledIds })

    expect(planetsRepository.findAll).toHaveBeenCalledTimes(1)
    expect(planetsRepository.replaceMany).toHaveBeenCalledTimes(1)

    const [reorderedPlanets] = planetsRepository.replaceMany.mock.calls[0]
    expect(reorderedPlanets).toHaveLength(3)
    expect(reorderedPlanets[0].id.value).toBe(shuffledIds[0])
    expect(reorderedPlanets[0].position.value).toBe(1)
    expect(reorderedPlanets[1].id.value).toBe(shuffledIds[1])
    expect(reorderedPlanets[1].position.value).toBe(2)
    expect(reorderedPlanets[2].id.value).toBe(shuffledIds[2])
    expect(reorderedPlanets[2].position.value).toBe(3)
  })

  it('should throw when any planet id is not found', async () => {
    const planets = PlanetsFaker.fakeMany(2)
    const missingPlanetId = faker.string.uuid()

    planetsRepository.findAll.mockResolvedValue(planets)

    await expect(
      useCase.execute({ planetIds: [planets[0].id.value, missingPlanetId] }),
    ).rejects.toThrow(PlanetNotFoundError)
  })
})
