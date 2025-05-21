import { mock, type Mock } from 'ts-jest-mocker'

import { UnlockFirstStarUseCase } from '../UnlockFirstStarUseCase'
import type { EventBroker } from '#global/interfaces/EventBroker'
import type { PlanetsRepository } from '../../interfaces'
import { FirstStarUnlockedEvent } from '#space/domain/events/FirstStarUnlockedEvent'
import { PlanetNotFoundError } from '#space/domain/errors/PlanetNotFoundError'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'
import { StarsFaker } from '#space/domain/entities/tests/fakers/StarsFaker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

describe('Unlock First Star Use Case', () => {
  let repository: Mock<PlanetsRepository>
  let eventBroker: Mock<EventBroker>
  let useCase: UnlockFirstStarUseCase

  beforeEach(() => {
    repository = mock<PlanetsRepository>()
    eventBroker = mock<EventBroker>()
    repository.findByPosition.mockImplementation()
    eventBroker.publish.mockImplementation()
    useCase = new UnlockFirstStarUseCase(repository, eventBroker)
  })

  it('should throw an error if the first planet is not found', async () => {
    const user = UsersFaker.fake()
    repository.findByPosition.mockResolvedValue(null)

    expect(
      useCase.execute({
        userId: user.id.value,
        userName: user.name.value,
        userEmail: user.email.value,
      }),
    ).rejects.toThrow(PlanetNotFoundError)
    expect(repository.findByPosition).toHaveBeenCalledWith(OrdinalNumber.create(1))
  })

  it('should publish an event when the first star is unlocked', async () => {
    const user = UsersFaker.fake()
    const firstStar = StarsFaker.fakeDto({ number: 1 })
    const firstPlanet = PlanetsFaker.fake({
      stars: [
        firstStar,
        StarsFaker.fakeDto({ number: 2 }),
        StarsFaker.fakeDto({ number: 3 }),
      ],
    })
    repository.findByPosition.mockResolvedValue(firstPlanet)

    await useCase.execute({
      userId: user.id.value,
      userName: user.name.value,
      userEmail: user.email.value,
    })

    expect(repository.findByPosition).toHaveBeenCalledWith(OrdinalNumber.create(1))
    expect(eventBroker.publish).toHaveBeenCalledWith(
      new FirstStarUnlockedEvent({
        user: {
          id: user.id.value,
          name: user.name.value,
          email: user.email.value,
        },
        firstStarId: String(firstStar.id),
      }),
    )
  })
})
