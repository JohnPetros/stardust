import { RestResponse } from '../../../global/responses'
import { AppError } from '../../../global/domain/errors'
import { HTTP_STATUS_CODE } from '../../../global/constants'
import { ProfileServiceMock } from '../../../mocks/services'
import { Achievement } from '../../domain/entities'
import { ObserveNewUnlockedAchievementsUseCase } from '../ObserveNewUnlockedAchievementsUseCase'
import { UsersFaker } from '../../../global/domain/entities/fakers'
import { AchievementsFaker } from '#profile/entities/fakers'
import { IdFaker } from '../../../global/domain/structures/fakers'

let useCase: ObserveNewUnlockedAchievementsUseCase
let profileService: ProfileServiceMock

describe('Observe New Unlocked Achievements Use Case', () => {
  beforeAll(() => {
    profileService = new ProfileServiceMock()
    useCase = new ObserveNewUnlockedAchievementsUseCase(profileService)
  })

  it('should not return any new unlocked achievements if user has no unlocked achivement', async () => {
    const userDto = UsersFaker.fakeDto()
    profileService.fakeAchievementsDto = [
      AchievementsFaker.fakeDto({ requiredCount: 1000 }),
    ]

    const { newUnlockedAchievements } = await useCase.do({ userDto })

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
    profileService.fakeAchievementsDto = [
      AchievementsFaker.fakeDto({ metric: 'xp', requiredCount: 99 }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'streak', requiredCount: 5 }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'completedChallengesCount', requiredCount: 1 }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'completedPlanetsCount', requiredCount: 2 }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'acquiredRocketsCount', requiredCount: 2 }), // Locked
      AchievementsFaker.fakeDto({ metric: 'unlockedStarsCount', requiredCount: 1 }), // Locked
    ]

    const { newUnlockedAchievements } = await useCase.do({ userDto })

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

    profileService.fakeAchievementsDto = [
      AchievementsFaker.fakeDto({
        metric: 'xp',
        requiredCount: 99,
        reward: unlockedAchievementReward,
      }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'streak', requiredCount: 99 }), // locked
    ]

    const { user } = await useCase.do({ userDto })

    expect(user.coins.value).toBe(unlockedAchievementReward)
  })

  it("should increment user's unlocked and rescuable achievements count with the quantity of the new unlocked achievements", async () => {
    const userDto = UsersFaker.fakeDto({
      xp: 101,
      streak: 0,
      unlockedAchievementsIds: [IdFaker.fake().value],
      rescuableAchievementsIds: [],
    })

    profileService.fakeAchievementsDto = [
      AchievementsFaker.fakeDto({
        metric: 'xp',
        requiredCount: 99,
      }), // Unlocked
      AchievementsFaker.fakeDto({ metric: 'streak', requiredCount: 99 }), // locked
    ]

    const { user } = await useCase.do({ userDto })

    expect(user.unlockedAchievementsCount.value).toBe(2)
    expect(user.rescueableAchievementsCount.value).toBe(1)
  })

  it('should save the new unlocked and rescuable achievements if any', async () => {
    const userDto = UsersFaker.fakeDto({
      xp: 101,
    })

    const fakeAchievement = AchievementsFaker.fakeDto({ metric: 'xp', requiredCount: 99 })

    profileService.fakeAchievementsDto = [fakeAchievement]

    const fakeSavedRescuedAchivementRequests: Record<string, string>[] = []

    profileService.saveUnlockedAchievement = async (
      unlcokedAchievementId: string,
      userId: string,
    ) => {
      fakeSavedRescuedAchivementRequests.push({ unlcokedAchievementId, userId })
      return new RestResponse()
    }

    profileService.saveRescuableAchievement = async (
      rescuableAchievementId: string,
      userId: string,
    ) => {
      fakeSavedRescuedAchivementRequests.push({ rescuableAchievementId, userId })
      return new RestResponse()
    }

    useCase = new ObserveNewUnlockedAchievementsUseCase(profileService)

    await useCase.do({ userDto })

    expect(fakeSavedRescuedAchivementRequests[0]?.unlcokedAchievementId).toBe(
      fakeAchievement.id,
    )
    expect(fakeSavedRescuedAchivementRequests[0]?.userId).toBe(userDto.id)
    expect(fakeSavedRescuedAchivementRequests[1]?.rescuableAchievementId).toBe(
      fakeAchievement.id,
    )
    expect(fakeSavedRescuedAchivementRequests[1]?.userId).toBe(userDto.id)
  })

  it('should throw error on save the new unlocked and rescuable achievements if any', async () => {
    const userDto = UsersFaker.fakeDto({
      xp: 5,
    })

    profileService.fakeAchievementsDto = [
      AchievementsFaker.fakeDto({ metric: 'xp', requiredCount: 1 }),
    ]

    profileService.saveUnlockedAchievement = async () => {
      return new RestResponse({ statusCode: HTTP_STATUS_CODE.serverError })
    }

    useCase = new ObserveNewUnlockedAchievementsUseCase(profileService)

    expect(async () => {
      await useCase.do({ userDto })
    }).rejects.toThrow(AppError)

    profileService.saveUnlockedAchievement = async () => new RestResponse()

    profileService.saveRescuableAchievement = async () => {
      return new RestResponse({ statusCode: HTTP_STATUS_CODE.serverError })
    }

    useCase = new ObserveNewUnlockedAchievementsUseCase(profileService)

    expect(async () => {
      await useCase.do({ userDto })
    }).rejects.toThrow(AppError)
  })
})
