import { mock, type Mock } from 'ts-jest-mocker'

import { AchievementsFaker, UsersFaker } from '#profile/domain/entities/fakers/index'
import { AchievementNotFoundError } from '#profile/errors/AchievementNotFoundError'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import type { AchievementsRepository, UsersRepository } from '#profile/interfaces/index'
import { RescueAchievementUseCase } from '../RescueAchievementUseCase'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'

let achievementsRepositoryMock: Mock<AchievementsRepository>
let usersRepositoryMock: Mock<UsersRepository>
let useCase: RescueAchievementUseCase

describe('Rescue Achievement Use Case', () => {
  beforeEach(() => {
    achievementsRepositoryMock = mock<AchievementsRepository>()
    usersRepositoryMock = mock<UsersRepository>()

    useCase = new RescueAchievementUseCase(
      achievementsRepositoryMock,
      usersRepositoryMock,
    )
  })

  it('should throw error if the achievement is not found', async () => {
    achievementsRepositoryMock.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        achievementId: IdFaker.fake().value,
        userId: IdFaker.fake().value,
      }),
    ).rejects.toThrow(AchievementNotFoundError)
  })

  it('should throw error if the user is not found', async () => {
    const achievement = AchievementsFaker.fake()
    achievementsRepositoryMock.findById.mockResolvedValue(achievement)
    usersRepositoryMock.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        achievementId: achievement.id.value,
        userId: IdFaker.fake().value,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should remove the rescued achievement from the repository', async () => {
    const achievement = AchievementsFaker.fake()
    const user = UsersFaker.fake()
    achievementsRepositoryMock.findById.mockResolvedValue(achievement)
    achievementsRepositoryMock.removeRescuable.mockResolvedValue()
    usersRepositoryMock.findById.mockResolvedValue(user)
    usersRepositoryMock.replace.mockResolvedValue()

    await useCase.execute({
      achievementId: achievement.id.value,
      userId: user.id.value,
    })

    expect(achievementsRepositoryMock.removeRescuable).toHaveBeenCalledWith(
      achievement.id,
      user.id,
    )
    // expect(usersRepositoryMock.replace).toHaveBeenCalledWith(user)
  })

  it('should make the user rescue the achievement', async () => {
    const achievement = AchievementsFaker.fake()
    const user = UsersFaker.fake()
    user.rescueAchievement = jest.fn()
    achievementsRepositoryMock.findById.mockResolvedValue(achievement)
    achievementsRepositoryMock.removeRescuable.mockResolvedValue()
    usersRepositoryMock.findById.mockResolvedValue(user)
    usersRepositoryMock.replace.mockResolvedValue()

    await useCase.execute({
      achievementId: achievement.id.value,
      userId: user.id.value,
    })

    expect(user.rescueAchievement).toHaveBeenCalledWith(
      achievement.id,
      achievement.reward,
    )
  })

  it('should replace the user in the repository', async () => {
    const achievement = AchievementsFaker.fake()
    const user = UsersFaker.fake()
    achievementsRepositoryMock.findById.mockResolvedValue(achievement)
    achievementsRepositoryMock.removeRescuable.mockResolvedValue()
    usersRepositoryMock.findById.mockResolvedValue(user)
    usersRepositoryMock.replace.mockResolvedValue()

    await useCase.execute({
      achievementId: achievement.id.value,
      userId: user.id.value,
    })

    expect(usersRepositoryMock.replace).toHaveBeenCalledWith(user)
  })

  it('should return the user dto', async () => {
    const achievement = AchievementsFaker.fake()
    const user = UsersFaker.fake()
    achievementsRepositoryMock.findById.mockResolvedValue(achievement)
    achievementsRepositoryMock.removeRescuable.mockResolvedValue()
    usersRepositoryMock.findById.mockResolvedValue(user)
    usersRepositoryMock.replace.mockResolvedValue()
    user.rescueAchievement(achievement.id, achievement.reward)

    const userDto = await useCase.execute({
      achievementId: achievement.id.value,
      userId: user.id.value,
    })

    expect(userDto).toEqual(user.dto)
  })
})
