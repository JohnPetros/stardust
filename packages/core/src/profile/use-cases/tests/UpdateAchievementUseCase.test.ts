import { mock, type Mock } from 'ts-jest-mocker'

import type { AchievementsRepository } from '#profile/interfaces/AchievementsRepository'
import { AchievementsFaker } from '#profile/domain/entities/fakers/AchievementsFaker'
import { AchievementNotFoundError } from '#profile/domain/errors/AchievementNotFoundError'
import { Achievement } from '#profile/domain/entities/Achievement'
import { UpdateAchievementUseCase } from '../UpdateAchievementUseCase'

describe('Update Achievement Use Case', () => {
  let repositoryMock: Mock<AchievementsRepository>
  let useCase: UpdateAchievementUseCase

  beforeAll(() => {
    repositoryMock = mock<AchievementsRepository>()
    repositoryMock.findById.mockImplementation()
    repositoryMock.replace.mockImplementation()

    useCase = new UpdateAchievementUseCase(repositoryMock)
  })

  it('should throw an error if the achievement is not found', async () => {
    const dto = AchievementsFaker.fakeDto()
    repositoryMock.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        achievementDto: dto,
      }),
    ).rejects.toThrow(AchievementNotFoundError)

    expect(repositoryMock.findById).toHaveBeenCalled()
    expect(repositoryMock.replace).not.toHaveBeenCalled()
  })

  it('should update an achievement with the given request data', async () => {
    const existingAchievement = AchievementsFaker.fake()
    const updatedDto = AchievementsFaker.fakeDto({
      id: existingAchievement.id.value,
    })
    let replacedAchievement: Achievement | undefined

    repositoryMock.findById.mockResolvedValue(existingAchievement)
    repositoryMock.replace.mockImplementation(async (achievement) => {
      replacedAchievement = achievement
    })

    const response = await useCase.execute({
      achievementDto: updatedDto,
    })

    const achievement = Achievement.create(updatedDto)
    expect(repositoryMock.findById).toHaveBeenCalledWith(existingAchievement.id)
    expect(repositoryMock.replace).toHaveBeenCalledWith(achievement)
    expect(replacedAchievement?.id).toEqual(achievement.id)
    expect(replacedAchievement?.name).toEqual(achievement.name)
    expect(replacedAchievement?.icon).toEqual(achievement.icon)
    expect(replacedAchievement?.description).toEqual(achievement.description)
    expect(replacedAchievement?.reward).toEqual(achievement.reward)
    expect(replacedAchievement?.requiredCount).toEqual(achievement.requiredCount)
    expect(replacedAchievement?.position).toEqual(achievement.position)
    expect(replacedAchievement?.metric).toEqual(achievement.metric)
    expect(response).toEqual(achievement.dto)
  })
})
