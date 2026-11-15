import { mock, type Mock } from 'ts-jest-mocker'

import type { PlanetsRepository } from '#space/interfaces/PlanetsRepository'
import type { GalaxiesRepository } from '#space/interfaces/GalaxiesRepository'
import { GalaxiesFaker } from '#space/domain/entities/fakers/GalaxiesFaker'
import { GalaxyNotFoundError } from '#space/domain/errors/GalaxyNotFoundError'
import type { Broker } from '#global/interfaces/Broker'
import { SpaceOrderChangedEvent } from '#space/domain/events/SpaceOrderChangedEvent'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'
import { HandleStarsNewOrderUseCase } from '../HandleStarsNewOrderUseCase'

describe('Handle Stars New Order Use Case', () => {
  let useCase: HandleStarsNewOrderUseCase
  let repository: Mock<PlanetsRepository>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let broker: Mock<Broker>
  const galaxy = GalaxiesFaker.fake({ position: 1 })

  beforeEach(() => {
    repository = mock<PlanetsRepository>()
    broker = mock<Broker>()
    galaxiesRepository = mock<GalaxiesRepository>()
    galaxiesRepository.findFirst.mockResolvedValue(galaxy)
    repository.findAllByGalaxy.mockImplementation()
    broker.publish.mockImplementation()
    useCase = new HandleStarsNewOrderUseCase(repository, galaxiesRepository, broker)
  })

  it('should publish the SpaceOrderChangedEvent with the list of star ids', async () => {
    const planets = PlanetsFaker.fakeMany(3)
    const stars = planets.flatMap((planet) => planet.stars)
    repository.findAllByGalaxy.mockResolvedValue(planets)

    await useCase.execute()

    expect(repository.findAllByGalaxy).toHaveBeenCalledTimes(1)
    expect(repository.findAllByGalaxy).toHaveBeenCalledWith(galaxy.id)
    expect(repository.findAll).not.toHaveBeenCalled()
    expect(broker.publish).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledWith(
      new SpaceOrderChangedEvent({
        reorderedStarIds: stars.map((star) => star.id.value),
      }),
    )
  })

  it('should throw GalaxyNotFoundError when there is no first galaxy', async () => {
    galaxiesRepository.findFirst.mockResolvedValue(null)

    await expect(useCase.execute()).rejects.toThrow(GalaxyNotFoundError)
    expect(broker.publish).not.toHaveBeenCalled()
  })
})
