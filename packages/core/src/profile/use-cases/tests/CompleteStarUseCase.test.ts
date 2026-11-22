import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { Broker } from '#global/interfaces/Broker'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { PlanetCompletedEvent } from '#space/domain/events/PlanetCompletedEvent'
import { CompleteStarUseCase } from '../CompleteStarUseCase'

describe('Complete Star Use Case', () => {
  let repository: Mock<UsersRepository>
  let broker: Mock<Broker>
  let useCase: CompleteStarUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    broker = mock<Broker>()
    repository.addCompletedStar.mockResolvedValue()
    broker.publish.mockResolvedValue()
    useCase = new CompleteStarUseCase(repository, broker)
  })

  it('should throw when the user is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: Id.create().value,
        starId: Id.create().value,
        completedPlanetName: null,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should add the completed star once and publish nothing in the middle of a planet', async () => {
    const user = UsersFaker.fake({ completedStarsIds: [] })
    repository.findById.mockResolvedValue(user)
    const starId = Id.create()

    await useCase.execute({
      userId: user.id.value,
      starId: starId.value,
      completedPlanetName: null,
    })

    expect(repository.addCompletedStar).toHaveBeenCalledTimes(1)
    expect(repository.addCompletedStar).toHaveBeenCalledWith(starId, user.id)
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should publish the planet completed event after saving the last star of a planet', async () => {
    const user = UsersFaker.fake({ completedStarsIds: [] })
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      starId: Id.create().value,
      completedPlanetName: 'Aurora',
    })

    expect(broker.publish).toHaveBeenCalledWith(
      new PlanetCompletedEvent({
        userName: user.name.value,
        userSlug: user.slug.value,
        planetName: 'Aurora',
      }),
    )
    const saveOrder = repository.addCompletedStar.mock.invocationCallOrder[0]
    const publishOrder = broker.publish.mock.invocationCallOrder[0]
    expect(saveOrder).toBeLessThan(publishOrder)
  })

  it('should neither save nor publish when the star was already completed', async () => {
    const starId = Id.create()
    const user = UsersFaker.fake({ completedStarsIds: [starId.value] })
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      starId: starId.value,
      completedPlanetName: 'Aurora',
    })

    expect(repository.addCompletedStar).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })
})
