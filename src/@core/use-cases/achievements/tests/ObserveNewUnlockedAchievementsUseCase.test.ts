import { AchievementsFaker, UsersFaker } from '@/@core/domain/entities/tests/fakers'
import { AchievementsServiceMock } from '@/@core/__tests__/mocks/services'
import { ObserveNewUnlockedAchievementsUseCase } from '../ObserveNewUnlockedAchievementsUseCase'
import { IdFaker } from '@/@core/domain/structs/tests/fakers'
import { Achievement } from '@/@core/domain/entities'
import { ServiceResponse } from '@/@core/responses'
import { AppError } from '@/@core/errors/global/AppError'

let useCase: ObserveNewUnlockedAchievementsUseCase
let achievementsService: AchievementsServiceMock

describe('Observe New Unlocked Achievements Use Case', () => {
  beforeAll(() => {
    achievementsService = new AchievementsServiceMock()
    useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)
  })

  it('should not return any new unlocked achievements if user has no unlocked achivement', async () => {
    const userDTO = UsersFaker.fakeDTO()
    const achievementsDTO = [AchievementsFaker.fakeDTO({ requiredCount: 1000 })]

    const { newUnlockedAchievements } = await useCase.do({ userDTO, achievementsDTO })

    expect(newUnlockedAchievements).toHaveLength(0)
  })

  it('should return new unlocked achievements if user metric count is greater than the one which is required by the respective achievement', async () => {
    const userDTO = UsersFaker.fakeDTO({
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
    const achievementsDTO = [
      AchievementsFaker.fakeDTO({ metric: 'xp', requiredCount: 99 }), // Unlocked
      AchievementsFaker.fakeDTO({ metric: 'streak', requiredCount: 5 }), // Unlocked
      AchievementsFaker.fakeDTO({ metric: 'completedChallengesCount', requiredCount: 1 }), // Unlocked
      AchievementsFaker.fakeDTO({ metric: 'completedPlanetsCount', requiredCount: 2 }), // Unlocked
      AchievementsFaker.fakeDTO({ metric: 'acquiredRocketsCount', requiredCount: 2 }), // Locked
      AchievementsFaker.fakeDTO({ metric: 'unlockedStarsCount', requiredCount: 1 }), // Locked
    ]

    const { newUnlockedAchievements } = await useCase.do({ achievementsDTO, userDTO })

    expect(newUnlockedAchievements).toHaveLength(4)

    for (const achievement of newUnlockedAchievements)
      expect(achievement).toBeInstanceOf(Achievement)
  })

  it("should increment user's coins with the respective unlocked achievement reward", async () => {
    const userDTO = UsersFaker.fakeDTO({
      xp: 101,
      streak: 0,
      coins: 0,
    })

    const unlockedAchievementReward = 50

    const achievementsDTO = [
      AchievementsFaker.fakeDTO({
        metric: 'xp',
        requiredCount: 99,
        reward: unlockedAchievementReward,
      }), // Unlocked
      AchievementsFaker.fakeDTO({ metric: 'streak', requiredCount: 99 }), // locked
    ]

    const { user } = await useCase.do({ achievementsDTO, userDTO })

    expect(user.coins.value).toBe(unlockedAchievementReward)
  })

  it("should increment user's unlocked and rescuable achievements count with the quantity of the new unlocked achievements", async () => {
    const userDTO = UsersFaker.fakeDTO({
      xp: 101,
      streak: 0,
      unlockedAchievementsIds: [IdFaker.fake().value],
      rescuableAchievementsIds: [],
    })

    const achievementsDTO = [
      AchievementsFaker.fakeDTO({
        metric: 'xp',
        requiredCount: 99,
      }), // Unlocked
      AchievementsFaker.fakeDTO({ metric: 'streak', requiredCount: 99 }), // locked
    ]

    const { user } = await useCase.do({ achievementsDTO, userDTO })

    expect(user.unlockedAchievementsCount.value).toBe(2)
    expect(user.rescueableAchievementsCount.value).toBe(1)
  })

  it('should save the new unlocked and rescuable achievements if any', async () => {
    const userDTO = UsersFaker.fakeDTO({
      xp: 101,
    })

    const fakeAchievement = AchievementsFaker.fakeDTO({ metric: 'xp', requiredCount: 99 })

    const achievementsDTO = [fakeAchievement]

    const fakeSavedRescuedAchivementRequests: Record<string, string>[] = []

    achievementsService.saveUnlockedAchievement = async (
      unlcokedAchievementId: string,
      userId: string
    ) => {
      fakeSavedRescuedAchivementRequests.push({ unlcokedAchievementId, userId })
      return new ServiceResponse(true)
    }

    achievementsService.saveRescuableAchievement = async (
      rescuableAchievementId: string,
      userId: string
    ) => {
      fakeSavedRescuedAchivementRequests.push({ rescuableAchievementId, userId })
      return new ServiceResponse(true)
    }

    useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)

    await useCase.do({ achievementsDTO, userDTO })

    expect(fakeSavedRescuedAchivementRequests[0].unlcokedAchievementId).toBe(
      fakeAchievement.id
    )
    expect(fakeSavedRescuedAchivementRequests[0].userId).toBe(userDTO.id)
    expect(fakeSavedRescuedAchivementRequests[1].rescuableAchievementId).toBe(
      fakeAchievement.id
    )
    expect(fakeSavedRescuedAchivementRequests[1].userId).toBe(userDTO.id)
  })

  it('should throw error on save the new unlocked and rescuable achievements if any', async () => {
    const userDTO = UsersFaker.fakeDTO({
      xp: 5,
    })

    const achievementsDTO = [
      AchievementsFaker.fakeDTO({ metric: 'xp', requiredCount: 1 }),
    ]

    achievementsService.saveUnlockedAchievement = async () => {
      return new ServiceResponse<boolean>(null, AppError)
    }

    useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)

    expect(async () => {
      await useCase.do({ achievementsDTO, userDTO })
    }).rejects.toThrow(AppError)

    achievementsService.saveUnlockedAchievement = async () => new ServiceResponse(true)

    achievementsService.saveRescuableAchievement = async () => {
      return new ServiceResponse<boolean>(null, AppError)
    }

    useCase = new ObserveNewUnlockedAchievementsUseCase(achievementsService)

    expect(async () => {
      await useCase.do({ achievementsDTO, userDTO })
    }).rejects.toThrow(AppError)
  })
})
