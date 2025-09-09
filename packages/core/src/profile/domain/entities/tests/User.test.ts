import { Id, Integer } from '#global/domain/structures/index'
import { ShopItemNotAcquiredError } from '#profile/errors/index'
import {
  AvatarAggregatesFaker,
  RocketAggregatesFaker,
  TierAggregatesFaker,
} from '../../aggregates/fakers'
import { WeekStatus } from '../../structures'
import { AchievementsFaker, UsersFaker } from '../fakers'

describe('User Entity', () => {
  it('should have the unlocked star id if unlocks the star', () => {
    const user = UsersFaker.fake({ unlockedStarsIds: [] })
    const starId = Id.create()

    expect(user.hasUnlockedStar(starId).value).toBeFalsy()

    user.unlockStar(starId)

    expect(user.hasUnlockedStar(starId).value).toBeTruthy()
  })

  it('should have the unlocked and rescuable achievement id if unlocks the achievement', () => {
    const user = UsersFaker.fake({
      unlockedAchievementsIds: [],
      rescuableAchievementsIds: [],
    })
    const achievementId = Id.create()

    expect(user.hasUnlockedAchievement(achievementId).value).toBeFalsy()
    expect(user.hasRescuableAchievement(achievementId).value).toBeFalsy()

    user.unlockAchievement(achievementId)

    expect(user.hasUnlockedAchievement(achievementId).value).toBeTruthy()
    expect(user.hasRescuableAchievement(achievementId).value).toBeTruthy()
  })

  it('should no longer have the rescuable achievement id if rescues the achievement', () => {
    const achievement = AchievementsFaker.fake()
    const user = UsersFaker.fake({
      rescuableAchievementsIds: [achievement.id.value],
    })

    expect(user.hasRescuableAchievement(achievement.id).value).toBeTruthy()

    user.rescueAchievement(achievement.id, achievement.reward)

    expect(user.hasRescuableAchievement(achievement.id).value).toBeFalsy()
  })

  it('should increase the coins count from the achievement reward if rescues the achievement', () => {
    const achievement = AchievementsFaker.fake({ reward: 100 })
    const user = UsersFaker.fake({ coins: 0 })

    expect(user.coins).toEqual(Integer.create(0))

    user.rescueAchievement(achievement.id, achievement.reward)

    expect(user.coins).toEqual(Integer.create(100))
  })

  it('should increase the coins count if earns coins', () => {
    const user = UsersFaker.fake({ coins: 0 })

    expect(user.coins).toEqual(Integer.create(0))

    user.earnCoins(Integer.create(100))

    expect(user.coins).toEqual(Integer.create(100))

    user.earnCoins(Integer.create(50))

    expect(user.coins).toEqual(Integer.create(150))
  })

  it('should decrease the coins count if loses coins', () => {
    const user = UsersFaker.fake({ coins: 100 })

    expect(user.coins).toEqual(Integer.create(100))

    user.loseCoins(Integer.create(20))

    expect(user.coins).toEqual(Integer.create(80))

    user.loseCoins(Integer.create(30))

    expect(user.coins).toEqual(Integer.create(50))
  })

  it('should increase the count of the xp and weekly xp if earns xp', () => {
    const user = UsersFaker.fake({ xp: 0, weeklyXp: 0 })

    expect(user.xp).toEqual(Integer.create(0))
    expect(user.weeklyXp).toEqual(Integer.create(0))

    user.earnXp(Integer.create(100))

    expect(user.xp).toEqual(Integer.create(100))
    expect(user.weeklyXp).toEqual(Integer.create(100))

    user.earnXp(Integer.create(50))

    expect(user.xp).toEqual(Integer.create(150))
    expect(user.weeklyXp).toEqual(Integer.create(150))
  })

  it('should try to up level if earns xp', () => {
    const user = UsersFaker.fake()
    const currentXp = user.xp
    const newXp = Integer.create(100)
    const levelUpSpy = jest.spyOn(user.level, 'up')

    user.earnXp(newXp)

    expect(levelUpSpy).toHaveBeenCalledWith(currentXp, newXp)
  })

  it('should indicate if can acquire a shop item or not by the coins count', () => {
    const user = UsersFaker.fake({ coins: 100 })
    let itemPrice = Integer.create(100)

    expect(user.canAcquire(itemPrice).value).toBeTruthy()

    itemPrice = Integer.create(150)

    expect(user.canAcquire(itemPrice).value).toBeFalsy()
  })

  it('should throw an error if try to select a rocket or avatar that is not acquired', () => {
    const user = UsersFaker.fake({
      acquiredRocketsIds: [],
      acquiredAvatarsIds: [],
    })
    const rocket = RocketAggregatesFaker.fake()
    const avatar = AvatarAggregatesFaker.fake()

    expect(() => user.selectRocket(rocket)).toThrow(ShopItemNotAcquiredError)
    expect(() => user.selectAvatar(avatar)).toThrow(ShopItemNotAcquiredError)
  })

  it('should select the rocket if it is not acquired', () => {
    const rocket = RocketAggregatesFaker.fake()
    const user = UsersFaker.fake({
      acquiredRocketsIds: [rocket.id.value],
    })

    expect(user.rocket).not.toEqual(rocket)

    user.selectRocket(rocket)

    expect(user.rocket).toEqual(rocket)
  })

  it('should select the avatar if it is not acquired', () => {
    const avatar = AvatarAggregatesFaker.fake()
    const user = UsersFaker.fake({
      acquiredAvatarsIds: [avatar.id.value],
    })

    expect(user.avatar).not.toEqual(avatar)

    user.selectAvatar(avatar)

    expect(user.avatar).toEqual(avatar)
  })

  it('should have the completed challenge id if completes a challenge', () => {
    const user = UsersFaker.fake({
      completedChallengesIds: [],
    })
    const challengeId = Id.create()

    expect(user.hasCompletedChallenge(challengeId).value).toBeFalsy()

    user.completeChallenge(challengeId)

    expect(user.hasCompletedChallenge(challengeId).value).toBeTruthy()
  })

  it('should have the acquired avatar id, select the avatar and lose coins if acquire a avatar', () => {
    const user = UsersFaker.fake({ coins: 100, acquiredAvatarsIds: [] })
    const avatar = AvatarAggregatesFaker.fake()
    const avatarPrice = Integer.create(10)

    expect(user.hasAcquiredAvatar(avatar.id).value).toBeFalsy()
    expect(user.isAvatarSelected(avatar.id).value).toBeFalsy()
    expect(user.coins).toEqual(Integer.create(100))

    user.acquireAvatar(avatar, avatarPrice)

    expect(user.hasAcquiredAvatar(avatar.id).value).toBeTruthy()
    expect(user.isAvatarSelected(avatar.id).value).toBeTruthy()
    expect(user.coins).toEqual(Integer.create(90))
  })

  it('should do nothing if the user does not have enough coins to acquire the avatar', () => {
    const user = UsersFaker.fake({ coins: 0, acquiredAvatarsIds: [] })
    const avatar = AvatarAggregatesFaker.fake()
    const avatarPrice = Integer.create(100)

    expect(user.hasAcquiredAvatar(avatar.id).value).toBeFalsy()
    expect(user.isAvatarSelected(avatar.id).value).toBeFalsy()
    expect(user.coins).toEqual(Integer.create(0))

    user.acquireAvatar(avatar, avatarPrice)

    expect(user.hasAcquiredAvatar(avatar.id).value).toBeFalsy()
    expect(user.isAvatarSelected(avatar.id).value).toBeFalsy()
    expect(user.coins).toEqual(Integer.create(0))
  })

  it('should just select the avatar if the avatar is already acquired', () => {
    const avatar = AvatarAggregatesFaker.fake()
    const avatarPrice = Integer.create(0)
    const user = UsersFaker.fake({
      coins: 100,
      acquiredAvatarsIds: [avatar.id.value],
      avatar: AvatarAggregatesFaker.fakeDto(),
    })

    expect(user.isAvatarSelected(avatar.id).value).toBeFalsy()
    expect(user.coins).toEqual(Integer.create(100))

    user.acquireAvatar(avatar, avatarPrice)

    expect(user.isAvatarSelected(avatar.id).value).toBeTruthy()
    expect(user.coins).toEqual(Integer.create(100))
  })

  it('should have the acquired rocket id, select the rocket and lose coins if acquire a rocket', () => {
    const user = UsersFaker.fake({ coins: 100, acquiredRocketsIds: [] })
    const rocket = RocketAggregatesFaker.fake()
    const rocketPrice = Integer.create(10)

    expect(user.hasAcquiredRocket(rocket.id).value).toBeFalsy()
    expect(user.isRocketSelected(rocket.id).value).toBeFalsy()
    expect(user.coins).toEqual(Integer.create(100))

    user.acquireRocket(rocket, rocketPrice)

    expect(user.hasAcquiredRocket(rocket.id).value).toBeTruthy()
    expect(user.isRocketSelected(rocket.id).value).toBeTruthy()
    expect(user.coins).toEqual(Integer.create(90))
  })

  it('should do nothing if the user does not have enough coins to acquire the rocket', () => {
    const user = UsersFaker.fake({ coins: 0, acquiredRocketsIds: [] })
    const rocket = RocketAggregatesFaker.fake()
    const rocketPrice = Integer.create(100)

    expect(user.hasAcquiredRocket(rocket.id).value).toBeFalsy()
    expect(user.isRocketSelected(rocket.id).value).toBeFalsy()
    expect(user.coins).toEqual(Integer.create(0))

    user.acquireRocket(rocket, rocketPrice)

    expect(user.hasAcquiredRocket(rocket.id).value).toBeFalsy()
    expect(user.isRocketSelected(rocket.id).value).toBeFalsy()
    expect(user.coins).toEqual(Integer.create(0))
  })

  it('should just select the rocket if the rocket is already acquired', () => {
    const rocket = RocketAggregatesFaker.fake()
    const rocketPrice = Integer.create(0)
    const user = UsersFaker.fake({
      coins: 100,
      acquiredRocketsIds: [rocket.id.value],
      rocket: RocketAggregatesFaker.fakeDto(),
    })

    expect(user.isRocketSelected(rocket.id).value).toBeFalsy()
    expect(user.coins).toEqual(Integer.create(100))

    user.acquireRocket(rocket, rocketPrice)

    expect(user.isRocketSelected(rocket.id).value).toBeTruthy()
    expect(user.coins).toEqual(Integer.create(100))
  })

  it('should have the completed challenge id if completes a non completed challenge', () => {
    const user = UsersFaker.fake({
      completedChallengesIds: [],
    })
    const challengeId = Id.create()

    expect(user.hasCompletedChallenge(challengeId).value).toBeFalsy()

    user.completeChallenge(challengeId)

    expect(user.hasCompletedChallenge(challengeId).value).toBeTruthy()
  })

  it('should have the upvoted comment id if upvotes a comment', () => {
    const user = UsersFaker.fake({
      upvotedCommentsIds: [],
    })
    const commentId = Id.create()

    expect(user.hasUpvotedComment(commentId).value).toBeFalsy()

    user.upvoteComment(commentId)

    expect(user.hasUpvotedComment(commentId).value).toBeTruthy()
  })

  it('should no longer have the upvoted comment id when remove the upvote from a comment', () => {
    const commentId = Id.create()
    const user = UsersFaker.fake({
      upvotedCommentsIds: [commentId.value],
    })

    expect(user.hasUpvotedComment(commentId).value).toBeTruthy()

    user.removeUpvoteComment(commentId)

    expect(user.hasUpvotedComment(commentId).value).toBeFalsy()
  })

  it('should have the upvoted solution id when upvotes a solution', () => {
    const user = UsersFaker.fake({
      upvotedSolutionsIds: [],
    })
    const solutionId = Id.create()

    expect(user.hasUpvotedSolution(solutionId).value).toBeFalsy()

    user.upvoteSolution(solutionId)

    expect(user.hasUpvotedSolution(solutionId).value).toBeTruthy()
  })

  it('should no longer have the upvoted solution id when remove the upvote from a solution', () => {
    const solutionId = Id.create()
    const user = UsersFaker.fake({
      upvotedSolutionsIds: [solutionId.value],
    })

    expect(user.hasUpvotedSolution(solutionId).value).toBeTruthy()

    user.removeUpvoteSolution(solutionId)

    expect(user.hasUpvotedSolution(solutionId).value).toBeFalsy()
  })

  it('should lose 10 coins if unlock the challenge solutions and the challenge is not completed yet', () => {
    const user = UsersFaker.fake({
      coins: 100,
      completedChallengesIds: [],
    })
    const challengeId = Id.create()

    expect(user.coins).toEqual(Integer.create(100))

    user.unlockChallengeSolutions(challengeId)

    expect(user.coins).toEqual(Integer.create(90))

    user.completeChallenge(challengeId)
    user.unlockChallengeSolutions(challengeId)

    expect(user.coins).toEqual(Integer.create(90))
  })

  it('should has completed the space when complete the space', () => {
    const user = UsersFaker.fake({
      hasCompletedSpace: false,
    })

    expect(user.hasCompletedSpace.value).toBeFalsy()

    user.completeSpace()

    expect(user.hasCompletedSpace.value).toBeTruthy()
  })

  it('should make the today status done when the today status is not todo', () => {
    let user = UsersFaker.fake({
      weekStatus: WeekStatus.create().value,
    })

    expect(user.weekStatus.todayStatus).toBe('todo')

    user.makeTodayStatusDone()

    expect(user.weekStatus.todayStatus).toBe('done')

    user = UsersFaker.fake({
      weekStatus: WeekStatus.create([
        'undone',
        'undone',
        'undone',
        'undone',
        'undone',
        'undone',
        'undone',
      ]).value,
    })

    user.makeTodayStatusDone()

    expect(user.weekStatus.todayStatus).toBe('undone')
  })

  it('should reset the week status', () => {
    const defaultWeekStatus = WeekStatus.create()
    const user = UsersFaker.fake({
      weekStatus: defaultWeekStatus.value,
    })

    user.makeTodayStatusDone()

    expect(user.weekStatus).not.toEqual(defaultWeekStatus)

    user.resetWeekStatus()

    expect(user.weekStatus).toEqual(defaultWeekStatus)
  })

  it('should reset streak to zero when breaks streak', () => {
    const streak = Integer.create(10)
    const user = UsersFaker.fake({
      streak: streak.value,
    })

    expect(user.streak).toEqual(streak)

    user.breakStreak()

    expect(user.streak).toEqual(Integer.create(0))
  })

  it('should indicate that did break the streak when breaks streak', () => {
    const user = UsersFaker.fake({
      didBreakStreak: false,
    })

    expect(user.didBreakStreak.value).toBeFalsy()

    user.breakStreak()

    expect(user.didBreakStreak.value).toBeTruthy()
  })

  it('should make the yesterday status undone when breaks streak', () => {
    const user = UsersFaker.fake({
      weekStatus: WeekStatus.create().value,
    })

    expect(user.weekStatus.yesterdayStatus).toBe('todo')

    user.breakStreak()

    expect(user.weekStatus.yesterdayStatus).toBe('undone')
  })

  it('should indicate that did not break the streak when resets the streak', () => {
    const user = UsersFaker.fake({
      didBreakStreak: true,
    })

    expect(user.didBreakStreak.value).toBeTruthy()

    user.resetStreak()

    expect(user.didBreakStreak.value).toBeFalsy()
  })

  it('should indicate that did not break the streak when resets the streak', () => {
    const user = UsersFaker.fake({
      didBreakStreak: true,
    })

    expect(user.didBreakStreak.value).toBeTruthy()

    user.resetStreak()

    expect(user.didBreakStreak.value).toBeFalsy()
  })

  it('should update the tier', () => {
    const newTier = TierAggregatesFaker.fake()
    const user = UsersFaker.fake({
      tier: TierAggregatesFaker.fakeDto(),
    })

    expect(user.tier.id).not.toEqual(newTier.id)

    user.updateTier(newTier.id)

    expect(user.tier.id).toEqual(newTier.id)
  })

  it('should decrement the count of the unlocked stars when returns it', () => {
    const user = UsersFaker.fake({
      unlockedStarsIds: [Id.create().value, Id.create().value, Id.create().value],
    })

    expect(user.unlockedStarsCount).toEqual(Integer.create(2))
  })

  it('should increment the count of the acquired rockets when returns it', () => {
    const user = UsersFaker.fake({
      acquiredRocketsIds: [Id.create().value, Id.create().value, Id.create().value],
    })

    expect(user.acquiredRocketsCount).toEqual(Integer.create(2))
  })
})
