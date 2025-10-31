import { type Mock, mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'

import { ReorderPlanetsUseCase } from '../ReorderPlanetsUseCase'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { PlanetNotFoundError } from '../../domain/errors'
import type { EventBroker } from '#global/interfaces/EventBroker'
import type { PlanetsRepository } from '../../interfaces'
import { PlanetsOrderChangedEvent } from '#space/domain/events/PlanetsOrderChangedEvent'

describe('Reorder Planets Use Case', () => {
  let useCase: ReorderPlanetsUseCase
  let repository: jest.Mocked<PlanetsRepository>
  let broker: Mock<EventBroker>

  beforeEach(() => {
    repository = mock<PlanetsRepository>()
    broker = mock<EventBroker>()
    useCase = new ReorderPlanetsUseCase(repository, broker)
  })

  it('should reorder planets to match the provided id sequence', async () => {
    const planets = PlanetsFaker.fakeMany(3)
    const shuffledIds = [planets[2].id.value, planets[0].id.value, planets[1].id.value]

    repository.findAll.mockResolvedValue(planets)
    repository.replaceMany.mockResolvedValue()

    await useCase.execute({ planetIds: shuffledIds })

    expect(repository.findAll).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledTimes(1)

    const [reorderedPlanets] = repository.replaceMany.mock.calls[0]
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

    repository.findAll.mockResolvedValue(planets)

    await expect(
      useCase.execute({ planetIds: [planets[0].id.value, missingPlanetId] }),
    ).rejects.toThrow(PlanetNotFoundError)
  })

  it('should publish the PlanetsOrderChangedEvent', async () => {
    repository.findAll.mockResolvedValue([])
    repository.replaceMany.mockResolvedValue()
    broker.publish.mockImplementation()

    await useCase.execute({ planetIds: [] })

    expect(broker.publish).toHaveBeenCalledTimes(1)

    expect(broker.publish).toHaveBeenCalledWith(new PlanetsOrderChangedEvent())
  })
})
