import { type Mock, mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import type { EventBroker } from '#global/interfaces/EventBroker'
import { SpaceCompletedEvent } from '#space/domain/events/SpaceCompletedEvent'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { CompleteSpaceUseCase } from '../CompleteSpaceUseCase'

describe('CompleteSpaceUseCase', () => {
  let repository: Mock<UsersRepository>
  let eventBroker: Mock<EventBroker>
  let useCase: CompleteSpaceUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    eventBroker = mock<EventBroker>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    eventBroker.publish.mockImplementation()
    useCase = new CompleteSpaceUseCase(repository, eventBroker)
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
    expect(eventBroker.publish).toHaveBeenCalledWith(
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
    expect(eventBroker.publish).not.toHaveBeenCalled()
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
    expect(eventBroker.publish).not.toHaveBeenCalled()
  })
})
