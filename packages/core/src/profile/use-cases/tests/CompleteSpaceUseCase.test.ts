import { type Mock, mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { Broker } from '#global/interfaces/Broker'
import { SpaceCompletedEvent } from '#space/domain/events/SpaceCompletedEvent'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { CompleteSpaceUseCase } from '../CompleteSpaceUseCase'

describe('CompleteSpaceUseCase', () => {
  let repository: Mock<UsersRepository>
  let Broker: Mock<Broker>
  let useCase: CompleteSpaceUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    Broker = mock<Broker>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    Broker.publish.mockImplementation()
    useCase = new CompleteSpaceUseCase(repository, Broker)
  })

  it('should throw an error if the user is not found', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(null)
    user.completeSpace = jest.fn()

    expect(
      useCase.execute({
        userId: user.id.value,
        nextStarId: null,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should complete the space and publish the space completed event if the next star is null', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)
    user.completeSpace = jest.fn()

    await useCase.execute({
      userId: user.id.value,
      nextStarId: null,
    })

    expect(user.completeSpace).toHaveBeenCalled()
    expect(repository.replace).toHaveBeenCalledWith(user)
    expect(Broker.publish).toHaveBeenCalledWith(
      new SpaceCompletedEvent({
        userSlug: user.slug.value,
        userName: user.name.value,
      }),
    )
  })

  it('should not complete the space and publish the space completed event if the next star is not null', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)
    user.completeSpace = jest.fn()

    await useCase.execute({
      userId: user.id.value,
      nextStarId: 'next-star-id',
    })

    expect(user.completeSpace).not.toHaveBeenCalled()
    expect(repository.replace).not.toHaveBeenCalled()
    expect(Broker.publish).not.toHaveBeenCalled()
  })

  it('should not complete the space and publish the space completed event if the user has already completed the space', async () => {
    const user = UsersFaker.fake({
      hasCompletedSpace: true,
    })
    repository.findById.mockResolvedValue(user)
    user.completeSpace = jest.fn()

    await useCase.execute({
      userId: user.id.value,
      nextStarId: 'next-star-id',
    })

    expect(user.completeSpace).not.toHaveBeenCalled()
    expect(repository.replace).not.toHaveBeenCalled()
    expect(Broker.publish).not.toHaveBeenCalled()
  })
})
