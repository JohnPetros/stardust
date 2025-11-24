import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'

import { CalculateRewardForChallengeCompletionUseCase } from '../CalculateRewardForChallengeCompletionUseCase'

describe('Calculate Reward For Challenge Completion Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: CalculateRewardForChallengeCompletionUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    useCase = new CalculateRewardForChallengeCompletionUseCase(repository)
  })

  it('should throw an error if the user is not found', () => {
    expect(
      useCase.execute({
        userId: Id.create().value,
        challengeId: Id.create().value,
        challengeXp: 0,
        challengeCoins: 0,
        maximumIncorrectAnswersCount: 0,
        incorrectAnswersCount: 0,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should discount the new xp in percentage based on the incorrect answers count and the accuracy percentage', async () => {
    const user = UsersFaker.fake({ completedChallengesIds: [] })
    repository.findById.mockResolvedValue(user)

    let response = await useCase.execute({
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 0,
      userId: user.id.value,
      challengeId: Id.create().value,
      challengeXp: 100,
      challengeCoins: 0,
    })

    expect(response.newXp).toBe(100) // 100% of 100 xp

    response = await useCase.execute({
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 2,
      userId: user.id.value,
      challengeId: Id.create().value,
      challengeXp: 100,
      challengeCoins: 0,
    })

    expect(response.newXp).toBe(80) // 80% of 100 xp

    response = await useCase.execute({
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 5,
      userId: user.id.value,
      challengeId: Id.create().value,
      challengeXp: 100,
      challengeCoins: 0,
    })

    expect(response.newXp).toBe(50) // 50% of 100 xp
  })

  it('should discount the new coins in percentage based on the incorrect answers count and the accuracy percentage', async () => {
    const user = UsersFaker.fake({ completedChallengesIds: [] })
    repository.findById.mockResolvedValue(user)

    let response = await useCase.execute({
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 0,
      userId: user.id.value,
      challengeId: Id.create().value,
      challengeXp: 0,
      challengeCoins: 100,
    })

    expect(response.newCoins).toBe(100) // 100% of 100 coins

    response = await useCase.execute({
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 2,
      userId: user.id.value,
      challengeId: Id.create().value,
      challengeXp: 0,
      challengeCoins: 100,
    })

    expect(response.newCoins).toBe(80) // 80% of 100 coins

    response = await useCase.execute({
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 5,
      userId: user.id.value,
      challengeId: Id.create().value,
      challengeXp: 0,
      challengeCoins: 100,
    })

    expect(response.newCoins).toBe(50) // 50% of 100 coins
  })

  it('should divide the new calculated xp by 2 if the user has completed the challenge', async () => {
    const challengeId = Id.create().value
    const user = UsersFaker.fake({
      completedChallengesIds: [challengeId],
      hasCompletedSpace: false,
    })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 0,
      userId: user.id.value,
      challengeId,
      challengeXp: 100,
      challengeCoins: 0,
    })

    expect(response.newXp).toBe(50) // 50% of 100 xp
  })

  it('should divide the new calculated coins by 2 if the user has completed the challenge', async () => {
    const challengeId = Id.create().value
    const user = UsersFaker.fake({
      completedChallengesIds: [challengeId],
      hasCompletedSpace: false,
    })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      maximumIncorrectAnswersCount: 10,
      incorrectAnswersCount: 0,
      userId: user.id.value,
      challengeId,
      challengeXp: 0,
      challengeCoins: 100,
    })

    expect(response.newCoins).toBe(50) // 50% of 100 coins
  })
})
