import { mock, type Mock } from 'ts-jest-mocker'

import { AchievementsFaker, UsersFaker } from '#profile/domain/entities/fakers/index'
import { AchievementNotFoundError } from '#profile/errors/AchievementNotFoundError'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import type { AchievementsRepository, UsersRepository } from '#profile/interfaces/index'
import { RescueAchievementUseCase } from '../RescueAchievementUseCase'
import { IdFaker } from '#global/domain/structures/fakers/IdFaker'

describe('Rescue Achievement Use Case', () => {
  let achievementsRepository: Mock<AchievementsRepository>
  let usersRepository: Mock<UsersRepository>
  let useCase: RescueAchievementUseCase
  beforeEach(() => {
    achievementsRepository = mock<AchievementsRepository>()
    usersRepository = mock<UsersRepository>()
    usersRepository.findById.mockImplementation()
    usersRepository.replace.mockImplementation()
    usersRepository.removeRescuableAchievement.mockImplementation()

    useCase = new RescueAchievementUseCase(achievementsRepository, usersRepository)
  })

  it('should throw error if the achievement is not found', async () => {
    achievementsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        achievementId: IdFaker.fake().value,
        userId: IdFaker.fake().value,
      }),
    ).rejects.toThrow(AchievementNotFoundError)
  })

  it('should throw error if the user is not found', async () => {
    const achievement = AchievementsFaker.fake()
    achievementsRepository.findById.mockResolvedValue(achievement)
    usersRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        achievementId: achievement.id.value,
        userId: IdFaker.fake().value,
      }),
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should remove the rescued achievement from the repository', async () => {
    const achievement = AchievementsFaker.fake()
    const user = UsersFaker.fake({
      rescuableAchievementsIds: [achievement.id.value],
    })
    achievementsRepository.findById.mockResolvedValue(achievement)
    usersRepository.findById.mockResolvedValue(user)
    usersRepository.replace.mockResolvedValue()

    await useCase.execute({
      achievementId: achievement.id.value,
      userId: user.id.value,
    })

    expect(usersRepository.removeRescuableAchievement).toHaveBeenCalledWith(
      achievement.id,
      user.id,
    )
  })

  it('should make the user rescue the achievement', async () => {
    const achievement = AchievementsFaker.fake()
    const user = UsersFaker.fake({
      rescuableAchievementsIds: [achievement.id.value],
    })
    user.rescueAchievement = jest.fn()
    achievementsRepository.findById.mockResolvedValue(achievement)
    usersRepository.removeRescuableAchievement.mockResolvedValue()
    usersRepository.findById.mockResolvedValue(user)
    usersRepository.replace.mockResolvedValue()

    await useCase.execute({
      achievementId: achievement.id.value,
      userId: user.id.value,
    })

    expect(user.rescueAchievement).toHaveBeenCalledWith(
      achievement.id,
      achievement.reward,
    )
  })

  it('should return the user dto', async () => {
    const achievement = AchievementsFaker.fake()
    const user = UsersFaker.fake()
    achievementsRepository.findById.mockResolvedValue(achievement)
    usersRepository.findById.mockResolvedValue(user)
    usersRepository.replace.mockResolvedValue()
    user.rescueAchievement(achievement.id, achievement.reward)

    const userDto = await useCase.execute({
      achievementId: achievement.id.value,
      userId: user.id.value,
    })

    expect(userDto).toEqual(user.dto)
  })
})
