import { AchievementsFaker, UsersFaker } from '@/@core/domain/entities/tests/fakers'
import { AchievementsServiceMock } from '@/@core/__tests__/mocks/services'
import { ObserveNewUnlockedAchievementsUseCase } from '../ObserveNewUnlockedAchievementsUseCase'
import { IdFaker } from '@/@core/domain/structs/tests/fakers'
import { Achievement } from '@/@core/domain/entities'
import { ServiceResponse } from '@stardust/core/responses'
import { AppError } from '@stardust/core/global/errors'

let useCase: ObserveNewUnlockedAchievementsUseCase
let achievementsService: AchievementsServiceMock

describe('Observe New Unlocked Achievements Use Case', () => {
  beforeAll(() => {
    achievementsService = new AchievementsServiceMock()
    useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)
  })

  it('should not return any new unlocked achievements if user has no unlocked achivement', async () => {
    const userDto = UsersFaker.fakeDto()
    const achievementsDto = [AchievementsFaker.fakeDto({ requiredCount: 1000 })]

    const { newUnlockedAchievements } = await useCase.do({ userDto, achievementsDto })

    expect(newUnlockedAchievements).toHaveLength(0)
  })

  it('should return new unlocked achievements if user metric count is greater than the one which is required by the respective achievement', async () => {
    const userDto = UsersFaker.fakeDto({
      xp: 101,
      streak: 10,
      completedChallengesIds: [
        IdFaker.fake().value,
        IdFaker.fake().value,
        IdFaker.fake().value,
      ],
      completedPlanetsIds: [IdFaker.fake().value, IdFaker.fake().value],
      acquiredRocketsIds: [IdFaker.fake().value],
      unlockedStarsIds: [IdFaker.fake().value],
    })
    const achievementsDto = [
      AchievementsFaker.fakeDto({ metric: 'xp', requiredCount: 99 }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'streak', requiredCount: 5 }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'completedChallengesCount', requiredCount: 1 }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'completedPlanetsCount', requiredCount: 2 }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'acquiredRocketsCount', requiredCount: 2 }), // Locked
      AchievementsFaker.fakeDto({ metric: 'unlockedStarsCount', requiredCount: 1 }), // Locked
    ]

    const { newUnlockedAchievements } = await useCase.do({ achievementsDto, userDto })

    expect(newUnlockedAchievements).toHaveLength(4)

    for (const achievement of newUnlockedAchievements)
      expect(achievement).toBeInstanceOf(Achievement)
  })

  it("should increment user's coins with the respective unlocked achievement reward", async () => {
    const userDto = UsersFaker.fakeDto({
      xp: 101,
      streak: 0,
      coins: 0,
    })

    const unlockedAchievementReward = 50

    const achievementsDto = [
      AchievementsFaker.fakeDto({
        metric: 'xp',
        requiredCount: 99,
        reward: unlockedAchievementReward,
      }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'streak', requiredCount: 99 }), // locked
    ]

    const { user } = await useCase.do({ achievementsDto, userDto })

    expect(user.coins.value).toBe(unlockedAchievementReward)
  })

  it("should increment user's unlocked and rescuable achievements count with the quantity of the new unlocked achievements", async () => {
    const userDto = UsersFaker.fakeDto({
      xp: 101,
      streak: 0,
      unlockedAchievementsIds: [IdFaker.fake().value],
      rescuableAchievementsIds: [],
    })

    const achievementsDto = [
      AchievementsFaker.fakeDto({
        metric: 'xp',
        requiredCount: 99,
      }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'streak', requiredCount: 99 }), // locked
    ]

    const { user } = await useCase.do({ achievementsDto, userDto })

    expect(user.unlockedAchievementsCount.value).toBe(2)
    expect(user.rescueableAchievementsCount.value).toBe(1)
  })

  it('should save the new unlocked and rescuable achievements if any', async () => {
    const userDto = UsersFaker.fakeDto({
      xp: 101,
    })

    const fakeAchievement = AchievementsFaker.fakeDto({ metric: 'xp', requiredCount: 99 })

    const achievementsDto = [fakeAchievement]

    const fakeSavedRescuedAchivementRequests: Record<string, string>[] = []

    achievementsService.saveUnlockedAchievement = async (
      unlcokedAchievementId: string,
      userId: string,
    ) => {
      fakeSavedRescuedAchivementRequests.push({ unlcokedAchievementId, userId })
      return new ServiceResponse(true)
    }

    achievementsService.saveRescuableAchievement = async (
      rescuableAchievementId: string,
      userId: string,
    ) => {
      fakeSavedRescuedAchivementRequests.push({ rescuableAchievementId, userId })
      return new ServiceResponse(true)
    }

    useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)

    await useCase.do({ achievementsDto, userDto })

    expect(fakeSavedRescuedAchivementRequests[0].unlcokedAchievementId).toBe(
      fakeAchievement.id,
    )
    expect(fakeSavedRescuedAchivementRequests[0].userId).toBe(userDto.id)
    expect(fakeSavedRescuedAchivementRequests[1].rescuableAchievementId).toBe(
      fakeAchievement.id,
    )
    expect(fakeSavedRescuedAchivementRequests[1].userId).toBe(userDto.id)
  })

  it('should throw error on save the new unlocked and rescuable achievements if any', async () => {
    const userDto = UsersFaker.fakeDto({
      xp: 5,
    })

    const achievementsDto = [
      AchievementsFaker.fakeDto({ metric: 'xp', requiredCount: 1 }),
    ]

    achievementsService.saveUnlockedAchievement = async () => {
      return new ServiceResponse<boolean>(null, AppError)
    }

    useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)

    expect(async () => {
      await useCase.do({ achievementsDto, userDto })
    }).rejects.toThrow(AppError)

    achievementsService.saveUnlockedAchievement = async () => new ServiceResponse(true)

    achievementsService.saveRescuableAchievement = async () => {
      return new ServiceResponse<boolean>(null, AppError)
    }

    useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)

    expect(async () => {
      await useCase.do({ achievementsDto, userDto })
    }).rejects.toThrow(AppError)
  })
})
