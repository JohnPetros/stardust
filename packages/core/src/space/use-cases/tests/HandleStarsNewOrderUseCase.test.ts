import { mock, type Mock } from 'ts-jest-mocker'

import type { PlanetsRepository } from '#space/interfaces/PlanetsRepository'
import type { EventBroker } from '#global/interfaces/EventBroker'
import { SpaceOrderChangedEvent } from '#space/domain/events/SpaceOrderChangedEvent'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'
import { HandleStarsNewOrderUseCase } from '../HandleStarsNewOrderUseCase'

describe('Handle Stars New Order Use Case', () => {
  let useCase: HandleStarsNewOrderUseCase
  let repository: Mock<PlanetsRepository>
  let broker: Mock<EventBroker>

  beforeEach(() => {
    repository = mock<PlanetsRepository>()
    broker = mock<EventBroker>()
    repository.findAll.mockImplementation()
    broker.publish.mockImplementation()
    useCase = new HandleStarsNewOrderUseCase(repository, broker)
  })

  it('should publish the SpaceOrderChangedEvent with the list of star ids', async () => {
    const planets = PlanetsFaker.fakeMany(3)
    const stars = planets.flatMap((planet) => planet.stars)
    repository.findAll.mockResolvedValue(planets)

    await useCase.execute()

    expect(repository.findAll).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledWith(
      new SpaceOrderChangedEvent({
        reorderedStarIds: stars.map((star) => star.id.value),
      }),
    )
  })
})
