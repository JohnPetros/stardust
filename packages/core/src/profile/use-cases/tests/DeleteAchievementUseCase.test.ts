import { mock, type Mock } from 'ts-jest-mocker'

import type { AchievementsRepository } from '#profile/interfaces/AchievementsRepository'
import { AchievementsFaker } from '#profile/domain/entities/fakers/AchievementsFaker'
import { AchievementNotFoundError } from '#profile/domain/errors/AchievementNotFoundError'
import { DeleteAchievementUseCase } from '../DeleteAchievementUseCase'

describe('Delete Achievement Use Case', () => {
  let repositoryMock: Mock<AchievementsRepository>
  let useCase: DeleteAchievementUseCase

  beforeAll(() => {
    repositoryMock = mock<AchievementsRepository>()
    repositoryMock.findById.mockImplementation()
    repositoryMock.remove.mockImplementation()

    useCase = new DeleteAchievementUseCase(repositoryMock)
  })

  it('should throw an error if the achievement is not found', async () => {
    const achievement = AchievementsFaker.fake()
    repositoryMock.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        achievementId: achievement.id.value,
      }),
    ).rejects.toThrow(AchievementNotFoundError)

    expect(repositoryMock.findById).toHaveBeenCalled()
    expect(repositoryMock.remove).not.toHaveBeenCalled()
  })

  it('should delete an achievement with the given achievement id', async () => {
    const achievement = AchievementsFaker.fake()
    let removedAchievement: typeof achievement | undefined

    repositoryMock.findById.mockResolvedValue(achievement)
    repositoryMock.remove.mockImplementation(async (achievementToRemove) => {
      removedAchievement = achievementToRemove
    })

    await useCase.execute({
      achievementId: achievement.id.value,
    })

    expect(repositoryMock.findById).toHaveBeenCalledWith(achievement.id)
    expect(repositoryMock.remove).toHaveBeenCalledWith(achievement)
    expect(removedAchievement?.id).toEqual(achievement.id)
    expect(removedAchievement?.name).toEqual(achievement.name)
  })
})
