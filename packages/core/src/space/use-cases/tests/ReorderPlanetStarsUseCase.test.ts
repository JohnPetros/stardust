import { mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'

import type { Broker } from '#global/interfaces/Broker'
import { ReorderPlanetStarsUseCase } from '../ReorderPlanetStarsUseCase'
import type { PlanetsRepository, StarsRepository } from '../../interfaces'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'
import { Id } from '#global/domain/structures/Id'
import { StarsOrderChangedEvent } from '#space/domain/events/StarsOrderChangedEvent'
import { ConflictError } from '#global/domain/errors/ConflictError'

describe('Reorder Planet Stars Use Case', () => {
  let useCase: ReorderPlanetStarsUseCase
  let broker: jest.Mocked<Broker>
  let planetsRepository: jest.Mocked<PlanetsRepository>
  let starsRepository: jest.Mocked<StarsRepository>

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    starsRepository = mock<StarsRepository>()
    broker = mock<Broker>()
    planetsRepository.findById.mockImplementation()
    starsRepository.replaceMany.mockImplementation()
    broker.publish.mockImplementation()
    useCase = new ReorderPlanetStarsUseCase(planetsRepository, starsRepository, broker)
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

  it('should throw ConflictError when duplicate star ids are provided', async () => {
    const planet = PlanetsFaker.fake()
    const duplicateId = planet.stars[0].id.value

    planetsRepository.findById.mockResolvedValue(planet)

    await expect(
      useCase.execute({
        planetId: planet.id.value,
        starIds: [duplicateId, duplicateId],
      }),
    ).rejects.toThrow(ConflictError)
  })

  it('should publish the StarsOrderChangedEvent', async () => {
    const planet = PlanetsFaker.fake()
    planetsRepository.findById.mockResolvedValue(PlanetsFaker.fake())
    starsRepository.replaceMany.mockResolvedValue()

    await useCase.execute({ planetId: planet.id.value, starIds: [] })

    expect(broker.publish).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledWith(new StarsOrderChangedEvent())
  })
})
