import { mock, type Mock } from 'ts-jest-mocker'

import type { AchievementsRepository } from '#profile/interfaces/AchievementsRepository'
import { AchievementsFaker } from '#profile/domain/entities/fakers/AchievementsFaker'
import { Achievement } from '#profile/domain/entities/Achievement'
import { CreateAchievementUseCase } from '../CreateAchievementUseCase'

describe('Create Achievement Use Case', () => {
  let repositoryMock: Mock<AchievementsRepository>
  let useCase: CreateAchievementUseCase

  beforeAll(() => {
    repositoryMock = mock<AchievementsRepository>()
    repositoryMock.add.mockImplementation()

    useCase = new CreateAchievementUseCase(repositoryMock)
  })

  it('should create an achievement with the given request data', async () => {
    const dto = AchievementsFaker.fakeDto()
    let addedAchievement: Achievement | undefined
    repositoryMock.add.mockImplementation(async (achievement) => {
      addedAchievement = achievement
    })

    const response = await useCase.execute({
      achievementDto: dto,
    })

    const achievement = Achievement.create(dto)
    expect(repositoryMock.add).toHaveBeenCalledWith(achievement)
    expect(addedAchievement?.id).toEqual(achievement.id)
    expect(addedAchievement?.name).toEqual(achievement.name)
    expect(addedAchievement?.icon).toEqual(achievement.icon)
    expect(addedAchievement?.description).toEqual(achievement.description)
    expect(addedAchievement?.reward).toEqual(achievement.reward)
    expect(addedAchievement?.requiredCount).toEqual(achievement.requiredCount)
    expect(addedAchievement?.position).toEqual(achievement.position)
    expect(addedAchievement?.metric).toEqual(achievement.metric)
    expect(response).toEqual(achievement.dto)
  })
})
