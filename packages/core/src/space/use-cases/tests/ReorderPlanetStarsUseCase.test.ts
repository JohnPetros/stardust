import { mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'

import type { EventBroker } from '#global/interfaces/EventBroker'
import { ReorderPlanetStarsUseCase } from '../ReorderPlanetStarsUseCase'
import type { PlanetsRepository, StarsRepository } from '../../interfaces'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'
import { Id } from '#global/domain/structures/Id'
import { StarsOrderChangedEvent } from '#space/domain/events/StarsOrderChangedEvent'

describe('Reorder Planet Stars Use Case', () => {
  let useCase: ReorderPlanetStarsUseCase
  let broker: jest.Mocked<EventBroker>
  let planetsRepository: jest.Mocked<PlanetsRepository>
  let starsRepository: jest.Mocked<StarsRepository>

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    starsRepository = mock<StarsRepository>()
    broker = mock<EventBroker>()
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

  it('should publish the StarsOrderChangedEvent', async () => {
    const planet = PlanetsFaker.fake()
    planetsRepository.findById.mockResolvedValue(PlanetsFaker.fake())
    starsRepository.replaceMany.mockResolvedValue()

    await useCase.execute({ planetId: planet.id.value, starIds: [] })

    expect(broker.publish).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledWith(new StarsOrderChangedEvent())
  })
})
