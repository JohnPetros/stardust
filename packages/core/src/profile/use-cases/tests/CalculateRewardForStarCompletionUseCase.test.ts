import { mock, type Mock } from 'ts-jest-mocker'

import type { UsersRepository } from '#profile/interfaces/UsersRepository'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'
import { CalculateRewardForStarCompletionUseCase } from '../CalculateRewardForStarCompletionUseCase'

describe('Calculate Reward For Star Completion Use Case', () => {
  let repository: Mock<UsersRepository>
  let useCase: CalculateRewardForStarCompletionUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    useCase = new CalculateRewardForStarCompletionUseCase(repository)
  })

  it('should throw an error if the user is not found', () => {
    expect(
      useCase.execute({
        userId: Id.create().value,
        starId: Id.create().value,
        nextStarId: null,
        questionsCount: 0,
        incorrectAnswersCount: 0,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should calculate accuracy percentage based on the incorrect answers count and questions count', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)

    let response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.accuracyPercentage).toBe(100) // 100% accuracy

    response = await useCase.execute({
      incorrectAnswersCount: 2,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.accuracyPercentage).toBe(80) // 80% accuracy

    response = await useCase.execute({
      incorrectAnswersCount: 5,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.accuracyPercentage).toBe(50) // 50% accuracy
  })

  it('should discount the new xp in percentage based on the incorrect answers count and questions count', async () => {
    let user = UsersFaker.fake({ hasCompletedSpace: false })
    repository.findById.mockResolvedValue(user)

    let response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newXp).toBe(60) // 100% of 60 xp

    user = UsersFaker.fake({ hasCompletedSpace: false })
    repository.findById.mockResolvedValue(user)

    response = await useCase.execute({
      incorrectAnswersCount: 2,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newXp).toBe(48) // 80% of 60 xp

    user = UsersFaker.fake({ hasCompletedSpace: false })
    repository.findById.mockResolvedValue(user)

    response = await useCase.execute({
      incorrectAnswersCount: 5,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newXp).toBe(30) // 50% of 60 xp
  })

  it('should discount the new coins in percentage based on the incorrect answers count and questions count', async () => {
    let user = UsersFaker.fake({ hasCompletedSpace: false })
    repository.findById.mockResolvedValue(user)

    let response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newCoins).toBe(40) // 100% of 40 coins

    user = UsersFaker.fake({ hasCompletedSpace: false })
    repository.findById.mockResolvedValue(user)

    response = await useCase.execute({
      incorrectAnswersCount: 2,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newCoins).toBe(32) // 80% of 40 coins

    user = UsersFaker.fake({ hasCompletedSpace: false })
    repository.findById.mockResolvedValue(user)

    response = await useCase.execute({
      incorrectAnswersCount: 5,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newCoins).toBe(20) // 50% of 40 coins

    user = UsersFaker.fake({
      completedPlanetsIds: PlanetsFaker.fakeMany(8).map((planet) => planet.id.value),
      hasCompletedSpace: true,
    })
    repository.findById.mockResolvedValue(user)

    response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newCoins).toBe(20) // 50% of 40 coins
  })

  it('should divide the new calculated coins by 2 if the next star was unlocked and the current star was recently unlocked', async () => {
    const starId = Id.create().value
    const nextStarId = Id.create().value
    const user = UsersFaker.fake({
      unlockedStarsIds: [nextStarId],
      recentlyUnlockedStarsIds: [starId],
      hasCompletedSpace: false,
    })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId,
      nextStarId,
      questionsCount: 10,
    })

    expect(response.newCoins).toBe(20) // 50% of 40 coins
  })

  it('should not divide the new calculated coins if the current star was not recently unlocked', async () => {
    const starId = Id.create().value
    const nextStarId = Id.create().value
    const user = UsersFaker.fake({
      unlockedStarsIds: [nextStarId],
      recentlyUnlockedStarsIds: [],
      hasCompletedSpace: false,
    })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId,
      nextStarId,
      questionsCount: 10,
    })

    expect(response.newCoins).toBe(40)
  })

  it('should divide the new calculated coins by 2 if the user has completed the space', async () => {
    const user = UsersFaker.fake({
      unlockedStarsIds: [],
      hasCompletedSpace: true,
    })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newCoins).toBe(20) // 50% of 40 coins
  })

  it('should divide the new calculated xp by 2 if the next star was unlocked and the current star was recently unlocked', async () => {
    const starId = Id.create().value
    const nextStarId = Id.create().value
    let user = UsersFaker.fake({
      unlockedStarsIds: [nextStarId],
      recentlyUnlockedStarsIds: [starId],
      hasCompletedSpace: false,
    })
    repository.findById.mockResolvedValue(user)

    let response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId,
      nextStarId,
      questionsCount: 10,
    })

    expect(response.newXp).toBe(30) // 50% of 60 xp

    user = UsersFaker.fake({
      completedPlanetsIds: PlanetsFaker.fakeMany(8).map((planet) => planet.id.value),
      hasCompletedSpace: true,
    })
    repository.findById.mockResolvedValue(user)

    response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newXp).toBe(30) // 50% of 60 xp
  })

  it('should not divide the new calculated xp if the current star was not recently unlocked', async () => {
    const starId = Id.create().value
    const nextStarId = Id.create().value
    const user = UsersFaker.fake({
      unlockedStarsIds: [nextStarId],
      recentlyUnlockedStarsIds: [],
      hasCompletedSpace: false,
    })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId,
      nextStarId,
      questionsCount: 10,
    })

    expect(response.newXp).toBe(60)
  })

  it('should divide the new calculated xp by 2 if the user has completed the space', async () => {
    const user = UsersFaker.fake({
      unlockedStarsIds: [],
      hasCompletedSpace: true,
    })
    repository.findById.mockResolvedValue(user)

    const response = await useCase.execute({
      incorrectAnswersCount: 0,
      userId: user.id.value,
      starId: Id.create().value,
      nextStarId: null,
      questionsCount: 10,
    })

    expect(response.newXp).toBe(30) // 50% of 60 xp
  })
})
