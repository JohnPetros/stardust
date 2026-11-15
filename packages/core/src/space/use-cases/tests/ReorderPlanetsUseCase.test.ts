import { type Mock, mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'

import { ReorderPlanetsUseCase } from '../ReorderPlanetsUseCase'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'
import { GalaxyNotFoundError, PlanetNotFoundError } from '../../domain/errors'
import type { Broker } from '#global/interfaces/Broker'
import type { GalaxiesRepository, PlanetsRepository } from '../../interfaces'
import { GalaxiesFaker } from '../../domain/entities/fakers/GalaxiesFaker'
import { PlanetsOrderChangedEvent } from '#space/domain/events/PlanetsOrderChangedEvent'
import { ConflictError } from '#global/domain/errors/ConflictError'

describe('Reorder Planets Use Case', () => {
  let useCase: ReorderPlanetsUseCase
  let repository: jest.Mocked<PlanetsRepository>
  let galaxiesRepository: Mock<GalaxiesRepository>
  const galaxy = GalaxiesFaker.fake({ position: 1 })
  let broker: Mock<Broker>

  beforeEach(() => {
    repository = mock<PlanetsRepository>()
    broker = mock<Broker>()
    galaxiesRepository = mock<GalaxiesRepository>()
    galaxiesRepository.findFirst.mockResolvedValue(galaxy)
    repository.replaceMany.mockImplementation()
    broker.publish.mockImplementation()
    useCase = new ReorderPlanetsUseCase(repository, galaxiesRepository, broker)
  })

  it('should reorder planets to match the provided id sequence', async () => {
    const planets = PlanetsFaker.fakeMany(3)
    const shuffledIds = [planets[2].id.value, planets[0].id.value, planets[1].id.value]

    repository.findAllByGalaxy.mockResolvedValue(planets)
    repository.replaceMany.mockResolvedValue()

    await useCase.execute({ planetIds: shuffledIds })

    expect(repository.findAllByGalaxy).toHaveBeenCalledTimes(1)
    expect(repository.findAllByGalaxy).toHaveBeenCalledWith(galaxy.id)
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

    repository.findAllByGalaxy.mockResolvedValue(planets)

    await expect(
      useCase.execute({ planetIds: [planets[0].id.value, missingPlanetId] }),
    ).rejects.toThrow(PlanetNotFoundError)
  })

  it('should throw ConflictError when duplicate planet ids are provided', async () => {
    const planets = PlanetsFaker.fakeMany(2)
    const duplicateId = planets[0].id.value

    repository.findAllByGalaxy.mockResolvedValue(planets)

    await expect(
      useCase.execute({ planetIds: [duplicateId, duplicateId] }),
    ).rejects.toThrow(ConflictError)
  })

  it('should publish the PlanetsOrderChangedEvent', async () => {
    repository.findAllByGalaxy.mockResolvedValue([])
    repository.replaceMany.mockResolvedValue()
    broker.publish.mockImplementation()

    await useCase.execute({ planetIds: [] })

    expect(broker.publish).toHaveBeenCalledTimes(1)

    expect(broker.publish).toHaveBeenCalledWith(new PlanetsOrderChangedEvent())
  })

  it('should throw PlanetNotFoundError when a planet id belongs to another galaxy', async () => {
    const galaxyPlanets = PlanetsFaker.fakeMany(2)
    const otherGalaxyPlanet = PlanetsFaker.fake()
    repository.findAllByGalaxy.mockResolvedValue(galaxyPlanets)

    await expect(
      useCase.execute({
        planetIds: [galaxyPlanets[0].id.value, otherGalaxyPlanet.id.value],
      }),
    ).rejects.toThrow(PlanetNotFoundError)
    expect(repository.replaceMany).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should throw GalaxyNotFoundError when there is no first galaxy', async () => {
    galaxiesRepository.findFirst.mockResolvedValue(null)

    await expect(useCase.execute({ planetIds: [] })).rejects.toThrow(GalaxyNotFoundError)
    expect(repository.replaceMany).not.toHaveBeenCalled()
  })
})
