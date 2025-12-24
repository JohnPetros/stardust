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

  it('should update an achievement and preserve its position', async () => {
    const existingAchievement = AchievementsFaker.fake({ position: 1 })
    const updatedDto = AchievementsFaker.fakeDto({
      id: existingAchievement.id.value,
      // Pass a different position which should be ignored
      position: 999,
    })
    let replacedAchievement: Achievement | undefined

    repositoryMock.findById.mockResolvedValue(existingAchievement)
    repositoryMock.replace.mockImplementation(async (achievement) => {
      replacedAchievement = achievement
    })

    const response = await useCase.execute({
      achievementDto: updatedDto,
    })

    const expectedAchievement = Achievement.create(updatedDto)
    // Manually correct the expected position
    expectedAchievement.position = existingAchievement.position

    expect(repositoryMock.findById).toHaveBeenCalledWith(existingAchievement.id)
    expect(repositoryMock.replace).toHaveBeenCalledWith(expectedAchievement)

    expect(replacedAchievement?.id.value).toEqual(expectedAchievement.id.value)
    expect(replacedAchievement?.name).toEqual(expectedAchievement.name)
    expect(replacedAchievement?.icon).toEqual(expectedAchievement.icon)
    expect(replacedAchievement?.description).toEqual(expectedAchievement.description)
    expect(replacedAchievement?.reward).toEqual(expectedAchievement.reward)
    expect(replacedAchievement?.requiredCount).toEqual(expectedAchievement.requiredCount)
    // Check key part:
    expect(replacedAchievement?.position.value).toEqual(
      existingAchievement.position.value,
    )
    expect(replacedAchievement?.position.value).not.toEqual(updatedDto.position)

    expect(replacedAchievement?.metric).toEqual(expectedAchievement.metric)
    expect(response).toEqual(expectedAchievement.dto)
  })
})
