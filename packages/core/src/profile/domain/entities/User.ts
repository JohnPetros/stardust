import {
  type Email,
  type Id,
  type Name,
  type Slug,
  type IdsList,
  Integer,
  Logical,
  type AccountProvider,
} from '#global/domain/structures/index'
import type { AvatarAggregate, RocketAggregate } from '../aggregates'
import { TierAggregate } from '../aggregates'
import { RankingPosition } from '#ranking/domain/structures/index'
import { Entity } from '#global/domain/abstracts/index'
import { UserFactory } from '#profile/factories/index'
import { ShopItemNotAcquiredError } from '#profile/errors/index'
import type { AchievementMetricValue } from '../types'
import { type Level, WeekStatus } from '../structures'
import type { UserDto } from './dtos'

type UserProps = {
  avatar: AvatarAggregate
  tier: TierAggregate
  rocket: RocketAggregate
  slug: Slug
  email: Email
  name: Name
  level: Level
  coins: Integer
  xp: Integer
  weeklyXp: Integer
  streak: Integer
  weekStatus: WeekStatus
  githubAccountId: Id | null
  googleAccountId: Id | null
  unlockedStarsIds: IdsList
  acquiredRocketsIds: IdsList
  acquiredAvatarsIds: IdsList
  unlockedAchievementsIds: IdsList
  unlockedDocsIds: IdsList
  rescuableAchievementsIds: IdsList
  completedChallengesIds: IdsList
  completedPlanetsIds: IdsList
  upvotedCommentsIds: IdsList
  upvotedSolutionsIds: IdsList
  canSeeRankingResult: Logical
  didBreakStreak: Logical
  hasCompletedSpace: Logical
  lastWeekRankingPosition: RankingPosition | null
  createdAt: Date
}

export class User extends Entity<UserProps> {
  static create(dto: UserDto): User {
    return new User(UserFactory.produce(dto), dto.id)
  }

  unlockAchievement(achievementId: Id): void {
    if (this.props.unlockedAchievementsIds.includes(achievementId).isFalse) {
      this.props.unlockedAchievementsIds =
        this.props.unlockedAchievementsIds.add(achievementId)
      this.props.rescuableAchievementsIds =
        this.props.rescuableAchievementsIds.add(achievementId)
    }
  }

  unlockStar(starId: Id): void {
    if (this.props.unlockedStarsIds.includes(starId).isFalse) {
      this.props.unlockedStarsIds = this.props.unlockedStarsIds.add(starId)
    }
  }

  rescueAchievement(achievementId: Id, achievementReward: Integer): void {
    this.props.rescuableAchievementsIds =
      this.props.rescuableAchievementsIds.remove(achievementId)

    this.earnCoins(achievementReward)
  }

  earnCoins(newCoins: Integer): void {
    this.props.coins = this.props.coins.plus(newCoins)
  }

  loseCoins(coins: Integer): void {
    this.props.coins = this.props.coins.minus(coins)
  }

  earnXp(newXp: Integer) {
    this.props.level = this.level.up(this.xp, newXp)
    this.props.xp = this.props.xp.plus(newXp)
    this.props.weeklyXp = this.props.weeklyXp.plus(newXp)
  }

  earnLastWeekRankingPositionReward(): void {
    if (!this.props.lastWeekRankingPosition) return

    const reward = this.rewardByLastWeekRankingPosition
    this.earnCoins(reward)
  }

  canAcquire(coins: Integer): Logical {
    return this.props.coins.isGreaterThanOrEqualTo(coins)
  }

  acquireRocket(rocket: RocketAggregate, rocketPrice: Integer): void {
    if (this.hasAcquiredRocket(rocket.id).isTrue) {
      this.selectRocket(rocket)
      return
    }

    if (this.canAcquire(rocketPrice).isTrue) {
      this.props.acquiredRocketsIds = this.props.acquiredRocketsIds.add(rocket.id)
      this.loseCoins(rocketPrice)
      this.selectRocket(rocket)
    }
  }

  acquireAvatar(avatar: AvatarAggregate, avatarPrice: Integer): void {
    if (this.hasAcquiredAvatar(avatar.id).isTrue) {
      this.selectAvatar(avatar)
      return
    }

    if (this.canAcquire(avatarPrice).isTrue) {
      this.props.acquiredAvatarsIds = this.props.acquiredAvatarsIds.add(avatar.id)
      this.loseCoins(avatarPrice)
      this.selectAvatar(avatar)
    }
  }

  unlockChallengeSolutions(challengeId: Id) {
    if (this.hasCompletedChallenge(challengeId).isFalse) {
      this.loseCoins(Integer.create(10))
    }
  }

  makeTodayStatusDone() {
    if (this.weekStatus.todayStatus !== 'todo') return

    this.props.weekStatus = this.weekStatus.updateTodayStatus('done')
    this.props.streak = this.streak.increment()
    return {
      newStreak: this.props.streak,
      newWeekStatus: this.props.weekStatus,
    }
  }

  resetWeekStatus() {
    this.props.weekStatus = WeekStatus.create()
  }

  breakStreak() {
    this.props.streak = Integer.create(0)
    this.props.didBreakStreak = this.props.didBreakStreak.becomeTrue()
    this.props.weekStatus = this.props.weekStatus.updateYesterdayWeekdayStatus('undone')
  }

  resetStreak() {
    this.props.didBreakStreak = this.didBreakStreak.becomeFalse()
  }

  getAchievementCount(metric: AchievementMetricValue) {
    return this[metric]
  }

  selectRocket(rocket: RocketAggregate): void {
    if (this.hasAcquiredRocket(rocket.id).isFalse) {
      throw new ShopItemNotAcquiredError()
    }
    this.props.rocket = rocket
  }

  selectAvatar(avatar: AvatarAggregate): void {
    if (this.hasAcquiredAvatar(avatar.id).isFalse) {
      throw new ShopItemNotAcquiredError()
    }
    this.props.avatar = avatar
  }

  seeRankingResult(): void {
    this.props.canSeeRankingResult = this.props.canSeeRankingResult.invertValue()
  }

  resetRankingLoserState(): void {
    this.props.lastWeekRankingPosition = null
  }

  hasUnlockedAchievement(achievementId: Id): Logical {
    return this.props.unlockedAchievementsIds.includes(achievementId)
  }

  hasRescuableAchievement(achievementId: Id): Logical {
    return this.props.rescuableAchievementsIds.includes(achievementId)
  }

  hasUnlockedStar(starId: Id): Logical {
    return this.props.unlockedStarsIds.includes(starId)
  }

  hasCompletedChallenge(challengeId: Id): Logical {
    return this.props.completedChallengesIds.includes(challengeId)
  }

  hasUpvotedComment(commentId: Id): Logical {
    return this.props.upvotedCommentsIds.includes(commentId)
  }

  hasUpvotedSolution(solutionId: Id): Logical {
    return this.props.upvotedSolutionsIds.includes(solutionId)
  }

  hasAcquiredRocket(rocketId: Id): Logical {
    return this.props.acquiredRocketsIds.includes(rocketId)
  }

  hasAcquiredAvatar(rocketId: Id): Logical {
    return this.props.acquiredAvatarsIds.includes(rocketId)
  }

  isRocketSelected(rocketId: Id): Logical {
    return Logical.create(rocketId.value === this.rocket.id.value)
  }

  isAvatarSelected(avatarId: Id): Logical {
    return Logical.create(avatarId.value === this.avatar.id.value)
  }

  upvoteComment(commentId: Id): void {
    this.props.upvotedCommentsIds = this.props.upvotedCommentsIds.add(commentId)
  }

  removeUpvoteComment(commentId: Id): void {
    this.props.upvotedCommentsIds = this.props.upvotedCommentsIds.remove(commentId)
  }

  upvoteSolution(solutionId: Id): void {
    this.props.upvotedSolutionsIds = this.props.upvotedSolutionsIds.add(solutionId)
  }

  removeUpvoteSolution(solutionId: Id): void {
    this.props.upvotedSolutionsIds = this.props.upvotedSolutionsIds.remove(solutionId)
  }

  completeChallenge(challengeId: Id): void {
    if (this.props.completedChallengesIds.includes(challengeId).isFalse) {
      this.props.completedChallengesIds =
        this.props.completedChallengesIds.add(challengeId)
    }
  }

  updateRankingPosition(rankingPosition: Integer): void {
    this.props.lastWeekRankingPosition = RankingPosition.create(rankingPosition.value)
    this.props.canSeeRankingResult = this.props.canSeeRankingResult.becomeTrue()
    this.props.weeklyXp = Integer.create(0)
  }

  updateTier(tierId: Id): void {
    this.props.tier = TierAggregate.create({
      id: tierId.value,
    })
  }

  completeSpace(): void {
    this.props.hasCompletedSpace = this.props.hasCompletedSpace.becomeTrue()
  }

  get canMakeTodayStatusDone(): Logical {
    return Logical.create(this.weekStatus.todayStatus === 'todo')
  }

  get hasCompletedSpace(): Logical {
    return this.props.hasCompletedSpace
  }

  get unlockedStarsCount(): Integer {
    return this.props.unlockedStarsIds.count.minus(Integer.create(1))
  }

  get acquiredRocketsCount() {
    return this.props.acquiredRocketsIds.count.minus(Integer.create(1))
  }

  get acquiredAvatarsCount() {
    return this.props.acquiredAvatarsIds.count
  }

  get unlockedAchievementsCount() {
    return this.props.unlockedAchievementsIds.count
  }

  get rescueableAchievementsCount() {
    return this.props.rescuableAchievementsIds.count
  }

  get completedChallengesCount() {
    return this.props.completedChallengesIds.count
  }

  get completedPlanetsCount() {
    return this.props.completedPlanetsIds.count
  }

  get isRankingWinner(): Logical {
    if (!this.props.lastWeekRankingPosition) return Logical.createAsFalse()

    return this.props.lastWeekRankingPosition.isInWinningArea
  }

  get isTopRankingWinner(): Logical {
    if (!this.props.lastWeekRankingPosition) return Logical.createAsFalse()

    return this.props.lastWeekRankingPosition.isInPodiumArea
  }

  get hasNextTier(): Logical {
    if (!this.props.lastWeekRankingPosition) return Logical.createAsFalse()
    return this.tier.position.number.isDifferentFrom(
      this.props.lastWeekRankingPosition.position.number,
    )
  }

  get rewardByLastWeekRankingPosition() {
    if (!this.props.lastWeekRankingPosition) return Integer.create(0)

    return this.props.lastWeekRankingPosition.getReward(this.tier.reward)
  }

  get email() {
    return this.props.email
  }

  get slug() {
    return this.props.slug
  }

  get avatar() {
    return this.props.avatar
  }

  get rocket() {
    return this.props.rocket
  }

  get tier() {
    return this.props.tier
  }

  get name() {
    return this.props.name
  }

  set name(name: Name) {
    this.props.name = name
    this.props.slug = name.slug
  }

  get coins() {
    return this.props.coins
  }

  get xp() {
    return this.props.xp
  }

  get weeklyXp() {
    return this.props.weeklyXp
  }

  get weekStatus() {
    return this.props.weekStatus
  }

  get streak() {
    return this.props.streak
  }

  get level() {
    return this.props.level
  }

  get githubAccountId() {
    return this.props.githubAccountId
  }

  get googleAccountId() {
    return this.props.googleAccountId
  }

  get completedChallengesIds() {
    return this.props.completedChallengesIds
  }

  get upvotedCommentsIds() {
    return this.props.upvotedCommentsIds
  }

  get upvotedSolutionsIds() {
    return this.props.upvotedSolutionsIds
  }

  get canSeeRankingResult() {
    return this.props.canSeeRankingResult
  }

  get didBreakStreak() {
    return this.props.didBreakStreak
  }

  get lastWeekRankingPosition() {
    return this.props.lastWeekRankingPosition
  }

  get createdAt() {
    return this.props.createdAt
  }

  setSocialAccountId(socialAccountId: Id, socialAccountProvider: AccountProvider) {
    if (socialAccountProvider.isGithubProvider.isTrue) {
      this.props.githubAccountId = socialAccountId
    } else if (socialAccountProvider.isGoogleProvider.isTrue) {
      this.props.googleAccountId = socialAccountId
    }
  }

  get dto(): UserDto {
    return {
      id: this.id.value,
      slug: this.slug.value,
      email: this.email.value,
      name: this.name.value,
      rocket: this.props.rocket.dto,
      avatar: this.props.avatar.dto,
      tier: this.props.tier.dto,
      level: this.level.value.number.value,
      coins: this.coins.value,
      xp: this.xp.value,
      weeklyXp: this.weeklyXp.value,
      streak: this.streak.value,
      weekStatus: this.props.weekStatus.value,
      unlockedStarsIds: this.props.unlockedStarsIds.dto,
      acquiredRocketsIds: this.props.acquiredRocketsIds.dto,
      acquiredAvatarsIds: this.props.acquiredAvatarsIds.dto,
      unlockedAchievementsIds: this.props.unlockedAchievementsIds.dto,
      rescuableAchievementsIds: this.props.rescuableAchievementsIds.dto,
      githubAccountId: this.props.githubAccountId?.value ?? undefined,
      googleAccountId: this.props.googleAccountId?.value ?? undefined,
      unlockedDocsIds: this.props.unlockedDocsIds.dto,
      upvotedCommentsIds: this.props.upvotedCommentsIds.dto,
      completedChallengesIds: this.props.completedChallengesIds.dto,
      completedPlanetsIds: this.props.completedPlanetsIds.dto,
      canSeeRankingResult: this.props.canSeeRankingResult.value,
      lastWeekRankingPosition:
        this.props.lastWeekRankingPosition?.position.number.value ?? null,
      didBreakStreak: this.props.didBreakStreak.value,
      hasCompletedSpace: this.hasCompletedSpace.value,
      createdAt: this.createdAt,
    }
  }
}
