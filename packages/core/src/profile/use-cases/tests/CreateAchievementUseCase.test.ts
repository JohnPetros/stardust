import { mock, type Mock } from 'ts-jest-mocker'

import type { AchievementsRepository } from '#profile/interfaces/AchievementsRepository'
import { AchievementsFaker } from '#profile/domain/entities/fakers/AchievementsFaker'
import { AchievementNotFoundError } from '#profile/domain/errors/AchievementNotFoundError'
import { CreateAchievementUseCase } from '../CreateAchievementUseCase'

describe('Create Achievement Use Case', () => {
  let repository: Mock<AchievementsRepository>
  let useCase: CreateAchievementUseCase

  beforeEach(() => {
    repository = mock<AchievementsRepository>()
    repository.findLastByPosition.mockImplementation()
    repository.add.mockImplementation()

    useCase = new CreateAchievementUseCase(repository)
  })

  it('should throw an error if there is no achievement to get the last position', () => {
    const achievementDto = AchievementsFaker.fakeDto()
    repository.findLastByPosition.mockResolvedValue(null)

    expect(
      useCase.execute({
        achievementDto,
      }),
    ).rejects.toThrow(AchievementNotFoundError)
  })

  it('should create an achievement with incremented position', async () => {
    const lastAchievement = AchievementsFaker.fake({ position: 5 })
    const achievementDto = AchievementsFaker.fakeDto()
    repository.findLastByPosition.mockResolvedValue(lastAchievement)

    const response = await useCase.execute({
      achievementDto,
    })

    expect(repository.findLastByPosition).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledTimes(1)

    const addedAchievement = repository.add.mock.calls[0][0]
    expect(addedAchievement.position.number.value).toBe(6)
    expect(response).toEqual(addedAchievement.dto)
  })
})
