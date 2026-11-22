import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { CalculateRewardForStarCompletionUseCase } from '../CalculateRewardForStarCompletionUseCase'

describe('Calculate Reward For Star Completion Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: CalculateRewardForStarCompletionUseCase

  const execute = (
    userId: string,
    incorrectAnswersCount: number,
    isAlreadyCompleted = false,
  ) =>
    useCase.execute({
      userId,
      isAlreadyCompleted,
      questionsCount: 10,
      incorrectAnswersCount,
    })

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    useCase = new CalculateRewardForStarCompletionUseCase(repository)
  })

  it('should throw an error if the user is not found', async () => {
    await expect(
      useCase.execute({
        userId: Id.create().value,
        isAlreadyCompleted: false,
        questionsCount: 0,
        incorrectAnswersCount: 0,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should calculate accuracy percentage based on the incorrect answers count and questions count', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    expect((await execute(user.id.value, 0)).accuracyPercentage).toBe(100)
    expect((await execute(user.id.value, 2)).accuracyPercentage).toBe(80)
    expect((await execute(user.id.value, 5)).accuracyPercentage).toBe(50)
  })

  it('should discount the new xp in percentage based on the incorrect answers count', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    expect((await execute(user.id.value, 0)).newXp).toBe(60)
    expect((await execute(user.id.value, 2)).newXp).toBe(48)
    expect((await execute(user.id.value, 5)).newXp).toBe(30)
  })

  it('should discount the new coins in percentage based on the incorrect answers count', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    expect((await execute(user.id.value, 0)).newCoins).toBe(40)
    expect((await execute(user.id.value, 2)).newCoins).toBe(32)
    expect((await execute(user.id.value, 5)).newCoins).toBe(20)
  })

  it('should pay half of the coins and xp when the star was already completed', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    const response = await execute(user.id.value, 0, true)

    expect(response.newCoins).toBe(20)
    expect(response.newXp).toBe(30)
  })

  it('should halve the xp, still discounted by the incorrect answers, when the star was already completed', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    expect((await execute(user.id.value, 0, true)).newXp).toBe(30)
    expect((await execute(user.id.value, 2, true)).newXp).toBe(24)
    expect((await execute(user.id.value, 5, true)).newXp).toBe(15)
  })

  it('should halve the coins, still discounted by the incorrect answers, when the star was already completed', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    expect((await execute(user.id.value, 0, true)).newCoins).toBe(20)
    expect((await execute(user.id.value, 2, true)).newCoins).toBe(16)
    expect((await execute(user.id.value, 5, true)).newCoins).toBe(10)
  })

  it('should pay the full reward on the first completion of a star', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    const response = await execute(user.id.value, 0, false)

    expect(response.newCoins).toBe(40)
    expect(response.newXp).toBe(60)
  })

  it('should not change the accuracy percentage when the star was already completed', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    expect((await execute(user.id.value, 2, true)).accuracyPercentage).toBe(80)
    expect((await execute(user.id.value, 2, false)).accuracyPercentage).toBe(80)
  })

  it('should pay the full reward for a new star even when the user has completed the space', async () => {
    const user = UsersFaker.fake({ hasCompletedSpace: true })
    repository.findById.mockResolvedValue(user)

    const response = await execute(user.id.value, 0, false)

    expect(response.newCoins).toBe(40)
    expect(response.newXp).toBe(60)
  })

  it('should reward nothing, with full accuracy, for a star without questions', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      userId: user.id.value,
      isAlreadyCompleted: false,
      questionsCount: 0,
      incorrectAnswersCount: 0,
    })

    expect(response).toEqual({ newCoins: 0, newXp: 0, accuracyPercentage: 100 })
  })
})
