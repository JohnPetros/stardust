import { mock } from 'ts-jest-mocker'
import { faker } from '@faker-js/faker'

import { ReorderAchievementsUseCase } from '../ReorderAchievementsUseCase'
import { AchievementsFaker } from '#profile/domain/entities/fakers/AchievementsFaker'
import { AchievementNotFoundError } from '#profile/domain/errors/AchievementNotFoundError'
import type { AchievementsRepository } from '#profile/interfaces/AchievementsRepository'

describe('Reorder Achievements Use Case', () => {
  let useCase: ReorderAchievementsUseCase
  let repository: jest.Mocked<AchievementsRepository>

  beforeEach(() => {
    repository = mock<AchievementsRepository>()
    repository.replaceMany.mockImplementation()
    useCase = new ReorderAchievementsUseCase(repository)
  })

  it('should reorder achievements to match the provided id sequence', async () => {
    const achievements = AchievementsFaker.fakeMany(3)
    const shuffledIds = [
      achievements[2].id.value,
      achievements[0].id.value,
      achievements[1].id.value,
    ]

    repository.findAll.mockResolvedValue(achievements)
    repository.replaceMany.mockResolvedValue()

    const response = await useCase.execute({ achievementIds: shuffledIds })

    expect(repository.findAll).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledTimes(1)

    const [reorderedAchievements] = repository.replaceMany.mock.calls[0]
    expect(reorderedAchievements).toHaveLength(3)
    expect(reorderedAchievements[0].id.value).toBe(shuffledIds[0])
    expect(reorderedAchievements[0].position.value).toBe(1)
    expect(reorderedAchievements[1].id.value).toBe(shuffledIds[1])
    expect(reorderedAchievements[1].position.value).toBe(2)
    expect(reorderedAchievements[2].id.value).toBe(shuffledIds[2])
    expect(reorderedAchievements[2].position.value).toBe(3)

    expect(response).toHaveLength(3)
    expect(response[0].id).toBe(shuffledIds[0])
    expect(response[1].id).toBe(shuffledIds[1])
    expect(response[2].id).toBe(shuffledIds[2])
  })

  it('should throw when any achievement id is not found', async () => {
    const achievements = AchievementsFaker.fakeMany(2)
    const missingAchievementId = faker.string.uuid()

    repository.findAll.mockResolvedValue(achievements)

    await expect(
      useCase.execute({
        achievementIds: [achievements[0].id.value, missingAchievementId],
      }),
    ).rejects.toThrow(AchievementNotFoundError)
  })

  it('should handle empty achievement ids list', async () => {
    repository.findAll.mockResolvedValue([])
    repository.replaceMany.mockResolvedValue()

    const response = await useCase.execute({ achievementIds: [] })

    expect(repository.findAll).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledTimes(1)
    expect(repository.replaceMany).toHaveBeenCalledWith([])
    expect(response).toHaveLength(0)
  })
})
