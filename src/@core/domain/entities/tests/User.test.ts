import { Observer } from '../../structs/Observer'
import { IdFaker } from '../../structs/tests/fakers'
import { AchievementsFaker, UsersFaker } from './fakers'

describe('User Entity', () => {
  it('should return whether user has the unlocked achievement or not', () => {
    const fakeUnlockedAchivementId = IdFaker.fake()

    const user = UsersFaker.fake({
      unlockedAchievementsIds: [fakeUnlockedAchivementId.value],
    })

    expect(user.hasUnlockedAchievement(fakeUnlockedAchivementId.value)).toBe(true)
    expect(user.hasUnlockedAchievement(IdFaker.fake().value)).toBe(false)
  })

  it('should return whether user has the rescuable achievement or not', () => {
    const fakeRescuableAchivementId = IdFaker.fake()

    const user = UsersFaker.fake({
      rescuableAchievementsIds: [fakeRescuableAchivementId.value],
    })

    expect(user.hasRescuableAchievement(fakeRescuableAchivementId.value)).toBe(true)
    expect(user.hasRescuableAchievement(IdFaker.fake().value)).toBe(false)
  })

  it('should return whether user has the unlocked star or not', () => {
    const fakeUnlockedStarId = IdFaker.fake()

    const user = UsersFaker.fake({
      unlockedStarsIds: [fakeUnlockedStarId.value],
    })

    expect(user.hasUnlockedStar(fakeUnlockedStarId.value)).toBe(true)
    expect(user.hasUnlockedStar(IdFaker.fake().value)).toBe(false)
  })

  it('should return whether user has the completed challenge or not', () => {
    const fakeCompletedChallengeId = IdFaker.fake()

    const user = UsersFaker.fake({
      completedChallengesIds: [fakeCompletedChallengeId.value],
    })

    expect(user.hasCompletedChallenge(fakeCompletedChallengeId.value)).toBe(true)
    expect(user.hasCompletedChallenge(IdFaker.fake().value)).toBe(false)
  })

  it('should return the count of unlocked achievements', () => {
    const user = UsersFaker.fake({
      unlockedAchievementsIds: [IdFaker.fake().value, IdFaker.fake().value],
    })

    expect(user.unlockedAchievementsCount.value).toBe(2)
  })

  it('should return the count of rescuableAchievementrs', () => {
    const user = UsersFaker.fake({
      rescuableAchievementsIds: [IdFaker.fake().value, IdFaker.fake().value],
    })

    expect(user.rescueableAchievementsCount.value).toBe(2)
  })

  it('should return the count of unlocked stars', () => {
    const user = UsersFaker.fake({
      unlockedStarsIds: [IdFaker.fake().value, IdFaker.fake().value],
    })

    expect(user.unlockedStarsCount.value).toBe(2)
  })

  it('should return the count of completed challenges', () => {
    const user = UsersFaker.fake({
      completedChallengesIds: [IdFaker.fake().value, IdFaker.fake().value],
    })

    expect(user.completedChallengesCount.value).toBe(2)
  })

  it('should return the count of completed planets', () => {
    const user = UsersFaker.fake({
      completedPlanetsIds: [IdFaker.fake().value, IdFaker.fake().value],
    })

    expect(user.completedPlanetsCount.value).toBe(2)
  })

  it('should earn coins', () => {
    const user = UsersFaker.fake({ coins: 10 })

    user.earnCoins(50)

    expect(user.coins.value).toBe(60)
  })

  it('should increment count of unlocked and rescuable achievements on unlock an achievement', () => {
    const fakeAchievement = AchievementsFaker.fake()

    const user = UsersFaker.fake({
      unlockedAchievementsIds: [],
      rescuableAchievementsIds: [],
    })

    user.unlockAchievement(fakeAchievement.id)

    expect(user.unlockedAchievementsCount.value).toBe(1)
    expect(user.rescueableAchievementsCount.value).toBe(1)
  })

  it('should increment coins with the rescued achievement on rescue the achievement', () => {
    const fakeAchievement = AchievementsFaker.fake()

    const user = UsersFaker.fake({
      coins: 0,
    })

    user.rescueAchievement(fakeAchievement.id, fakeAchievement.reward.value)

    expect(user.coins.value).toBe(fakeAchievement.reward.value)
  })

  it('should decrement rescuable achievements count with the rescued achievement', () => {
    const fakeAchievement = AchievementsFaker.fake()

    const user = UsersFaker.fake({
      rescuableAchievementsIds: [],
    })

    user.unlockAchievement(fakeAchievement.id)

    expect(user.rescueableAchievementsCount.value).toBe(1)

    user.rescueAchievement(fakeAchievement.id, fakeAchievement.reward.value)

    expect(user.rescueableAchievementsCount.value).toBe(0)
  })

  it('should notify changes', () => {
    const fakeAchievement = AchievementsFaker.fake()

    const callback = jest.fn()

    const user = UsersFaker.fake()
    user.observer = new Observer(callback)

    user.unlockAchievement(fakeAchievement.id)
    expect(callback).toHaveBeenCalled()

    user.rescueAchievement(fakeAchievement.id, fakeAchievement.reward.value)
    expect(callback).toHaveBeenCalled()

    user.earnCoins(42)
    expect(callback).toHaveBeenCalled()
  })

  it.each([
    'unlockedStarsCount',
    'acquiredRocketsCount',
    'completedChallengesCount',
    'completedPlanetsCount',
    'xp',
    'streak',
  ])("should return user's %i value", (metric) => {
    const user = UsersFaker.fake()

    // @ts-ignore
    expect(user[metric]).toEqual(user.getAchievementCount(metric))
  })
})
