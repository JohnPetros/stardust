import { mock, type Mock } from 'ts-jest-mocker'

import { AchievementsFaker } from '#profile/domain/entities/fakers/AchievementsFaker'
import { UsersFaker } from '#profile/domain/entities/fakers/index'
import type { UsersRepository, AchievementsRepository } from '#profile/interfaces/index'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'
import { Achievement } from '#profile/domain/entities/Achievement'
import { ObserveNewUnlockedAchievementsUseCase } from '../ObserveNewUnlockedAchievementsUseCase'

describe('Observe New Unlocked Achievements Use Case', () => {
  let usersRepository: Mock<UsersRepository>
  let achievementsRepository: Mock<AchievementsRepository>
  let useCase: ObserveNewUnlockedAchievementsUseCase

  beforeEach(() => {
    usersRepository = mock<UsersRepository>()
    achievementsRepository = mock<AchievementsRepository>()
    usersRepository.findById.mockImplementation()
    usersRepository.replace.mockImplementation()
    achievementsRepository.findAll.mockImplementation()
    usersRepository.addUnlockedAchievement.mockImplementation()
    usersRepository.addRescuableAchievement.mockImplementation()

    useCase = new ObserveNewUnlockedAchievementsUseCase(
      usersRepository,
      achievementsRepository,
    )
  })

  it('should throw error if user is not found', async () => {
    usersRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ userId: IdFaker.fake().value })).rejects.toThrow(
      UserNotFoundError,
    )
  })

  it('should not return any new unlocked achievements if user has no unlocked achivement', async () => {
    const user = UsersFaker.fake({ xp: 0 })
    usersRepository.findById.mockResolvedValueOnce(user)
    achievementsRepository.findAll.mockResolvedValueOnce(
      AchievementsFaker.fakeMany(10, { requiredCount: 1000, metric: 'xp' }),
    )

    const newUnlockedAchievements = await useCase.execute({ userId: user.id.value })

    expect(newUnlockedAchievements).toHaveLength(0)
  })

  it('should make the user unlock the achievement if the user metric count is greater than the one which is required by the respective achievement', async () => {
    const user = UsersFaker.fake({
      xp: 100,
      streak: 0,
    })
    user.unlockAchievement = jest.fn()
    const unlockedAchievement = AchievementsFaker.fake({
      metric: 'xp',
      requiredCount: 99,
    })
    const lockedAchievement = AchievementsFaker.fake({
      metric: 'streak',
      requiredCount: 99,
    })
    usersRepository.findById.mockResolvedValueOnce(user)
    achievementsRepository.findAll.mockResolvedValue([
      unlockedAchievement,
      lockedAchievement,
    ])

    await useCase.execute({ userId: user.id.value })

    expect(user.unlockAchievement).toHaveBeenCalledTimes(1)
    expect(user.unlockAchievement).toHaveBeenCalledWith(unlockedAchievement.id)
    expect(user.unlockAchievement).not.toHaveBeenCalledWith(lockedAchievement.id)
  })

  it('should return the new unlocked achievements if the user metric count is greater than the one which is required by the respective achievement', async () => {
    const user = UsersFaker.fake({
      xp: 100,
      streak: 10,
      completedChallengesIds: [
        IdFaker.fake().value,
        IdFaker.fake().value,
        IdFaker.fake().value,
      ],
      completedPlanetsIds: [
        IdFaker.fake().value,
        IdFaker.fake().value,
        IdFaker.fake().value,
      ],
      acquiredRocketsIds: [IdFaker.fake().value],
      unlockedStarsIds: [IdFaker.fake().value],
    })
    usersRepository.findById.mockResolvedValue(user)
    const unlockedAchievements = [
      AchievementsFaker.fakeDto({ metric: 'xp', requiredCount: 100 }),
      AchievementsFaker.fakeDto({ metric: 'streak', requiredCount: 9 }),
      AchievementsFaker.fakeDto({ metric: 'completedChallengesCount', requiredCount: 3 }),
      AchievementsFaker.fakeDto({ metric: 'completedPlanetsCount', requiredCount: 2 }),
    ]
    const lockedAchievements = [
      AchievementsFaker.fakeDto({ metric: 'acquiredRocketsCount', requiredCount: 1 }),
      AchievementsFaker.fakeDto({ metric: 'unlockedStarsCount', requiredCount: 1 }),
    ]
    achievementsRepository.findAll.mockResolvedValue([
      ...unlockedAchievements.map(Achievement.create),
      ...lockedAchievements.map(Achievement.create),
    ])

    const newUnlockedAchievements = await useCase.execute({ userId: user.id.value })

    expect(newUnlockedAchievements).toHaveLength(unlockedAchievements.length)
    expect(newUnlockedAchievements.sort()).toEqual(unlockedAchievements.sort())
  })

  it('should make the unlocked achievements be added to the repository as unlocked and rescuable', async () => {
    const user = UsersFaker.fake({
      xp: 100,
      streak: 0,
    })
    usersRepository.findById.mockResolvedValue(user)
    const unlockedAchievement = AchievementsFaker.fake({
      metric: 'xp',
      requiredCount: 99,
    })
    const lockedAchievement = AchievementsFaker.fake({
      metric: 'streak',
      requiredCount: 99,
    })
    achievementsRepository.findAll.mockResolvedValue([
      unlockedAchievement,
      lockedAchievement,
    ])

    await useCase.execute({ userId: user.id.value })

    expect(usersRepository.addUnlockedAchievement).toHaveBeenCalledTimes(1)
    expect(usersRepository.addRescuableAchievement).toHaveBeenCalledTimes(1)
    expect(usersRepository.addUnlockedAchievement).toHaveBeenCalledWith(
      unlockedAchievement.id,
      user.id,
    )
    expect(usersRepository.addRescuableAchievement).toHaveBeenCalledWith(
      unlockedAchievement.id,
      user.id,
    )
    expect(usersRepository.addRescuableAchievement).not.toHaveBeenCalledWith(
      lockedAchievement.id,
      user.id,
    )
    expect(usersRepository.addRescuableAchievement).not.toHaveBeenCalledWith(
      lockedAchievement.id,
      user.id,
    )
  })
})
