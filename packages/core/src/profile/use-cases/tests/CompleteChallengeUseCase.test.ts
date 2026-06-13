import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker } from '#global/interfaces/Broker'
import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { Id } from '#global/domain/structures/Id'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { ChallengeCompletedEvent } from '#profile/domain/events/ChallengeCompletedEvent'
import { CompleteChallengeUseCase } from '../CompleteChallengeUseCase'

describe('Complete Challenge Use Case', () => {
  let broker: Mock<Broker>
  let repository: Mock<UsersRepository>
  let useCase: CompleteChallengeUseCase

  beforeEach(() => {
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.addCompletedChallenge.mockImplementation()
    useCase = new CompleteChallengeUseCase(repository, broker)
  })

  it('should throw an error if the user is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        challengeId: Id.create().value,
        userId: Id.create().value,
      }),
    ).rejects.toThrow(UserNotFoundError)

    expect(repository.addCompletedChallenge).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should complete the challenge', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)
    user.completeChallenge = jest.fn()
    const challengeId = Id.create()

    await useCase.execute({
      challengeId: challengeId.value,
      userId: user.id.value,
    })

    expect(repository.addCompletedChallenge).toHaveBeenCalledWith(challengeId, user.id)
    expect(user.completeChallenge).toHaveBeenCalledWith(challengeId)
    expect(broker.publish).toHaveBeenCalledWith(
      expect.objectContaining<ChallengeCompletedEvent>({
        name: ChallengeCompletedEvent._NAME,
        payload: {
          userId: user.id.value,
          challengeId: challengeId.value,
        },
      }),
    )
  })

  it('should not complete the challenge if the user has already completed the challenge', async () => {
    const challengeId = Id.create()
    const user = UsersFaker.fake({ completedChallengesIds: [challengeId.value] })
    repository.findById.mockResolvedValue(user)
    user.completeChallenge = jest.fn()

    await useCase.execute({
      challengeId: challengeId.value,
      userId: user.id.value,
    })

    expect(repository.addCompletedChallenge).not.toHaveBeenCalled()
    expect(user.completeChallenge).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should return the user dto', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      challengeId: Id.create().value,
      userId: user.id.value,
    })

    expect(response).toEqual(user.dto)
  })
})
