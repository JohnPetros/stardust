import { mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'

import { DeletePlanetUseCase } from '../DeletePlanetUseCase'
import type { PlanetsRepository } from '../../interfaces'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'

describe('Delete Planet Use Case', () => {
  let useCase: DeletePlanetUseCase
  let planetsRepository: jest.Mocked<PlanetsRepository>

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    useCase = new DeletePlanetUseCase(planetsRepository)
  })

  it('should delete the planet when it exists', async () => {
    const planet = PlanetsFaker.fake()
    planetsRepository.findById.mockResolvedValue(planet)
    planetsRepository.remove.mockResolvedValue()

    await useCase.execute({ planetId: planet.id.value })

    expect(planetsRepository.findById).toHaveBeenCalledTimes(1)
    const [idParam] = planetsRepository.findById.mock.calls[0]
    expect(idParam.value).toBe(planet.id.value)
    expect(planetsRepository.remove).toHaveBeenCalledTimes(1)
    expect(planetsRepository.remove).toHaveBeenCalledWith(planet.id)
  })

  it('should throw when the planet does not exist', async () => {
    planetsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ planetId: faker.string.uuid() }),
    ).rejects.toThrow(PlanetNotFoundError)

    expect(planetsRepository.remove).not.toHaveBeenCalled()
  })
})
