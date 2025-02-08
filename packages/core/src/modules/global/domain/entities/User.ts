import { Entity } from '#global/abstracts'
import type { Tier } from '#ranking/entities'
import type { UserDto } from '#global/dtos'
import {
  Logical,
  Integer,
  type Email,
  type Name,
  type Slug,
  type Observer,
  type List,
} from '#global/structs'
import { UserFactory } from '#global/factories'
import type { Avatar, Rocket } from '#shop/entities'
import type { Level, WeekStatus } from '#profile/structs'
import type { AchievementMetricValue } from '#profile/types'
import type { RankingPosition } from '#ranking/structs'
import type { Comment } from '#forum/entities'
import type { Challenge, Solution } from '#challenging/entities'
import { PLANETS_COUNT } from '#space/constants'
import { EntityNotDefinedError } from '#global/errors'

type UserProps = {
  avatar: {
    id: string
    entity?: Avatar
  }
  tier: {
    id: string
    entity?: Tier
  }
  rocket: {
    id: string
    entity?: Rocket
  }
  slug: Slug
  email: Email
  name: Name
  level: Level
  coins: Integer
  xp: Integer
  weeklyXp: Integer
  streak: Integer
  weekStatus: WeekStatus
  unlockedStarsIds: List<string>
  acquiredRocketsIds: List<string>
  acquiredAvatarsIds: List<string>
  unlockedAchievementsIds: List<string>
  unlockedDocsIds: List<string>
  rescuableAchievementsIds: List<string>
  completedChallengesIds: List<string>
  completedPlanetsIds: List<string>
  upvotedCommentsIds: List<string>
  upvotedSolutionsIds: List<string>
  canSeeRankingResult: Logical
  didBreakStreak: Logical
  lastWeekRankingPosition: RankingPosition | null
  hasCompletedSpace: Logical
  createdAt: Date
  _observer?: Observer
}

export class User extends Entity<UserProps> {
  static create(dto: UserDto): User {
    return new User(UserFactory.produce(dto), dto.id)
  }

  unlockAchievement(achievementId: string): void {
    this.props.unlockedAchievementsIds.add(achievementId)
    this.props.rescuableAchievementsIds.add(achievementId)

    this.notifyChanges()
  }

  unlockStar(starId: string): void {
    this.props.unlockedStarsIds.add(starId)

    this.notifyChanges()
  }

  rescueAchievement(achievementId: string, achievementReward: number): void {
    this.props.rescuableAchievementsIds =
      this.props.rescuableAchievementsIds.remove(achievementId)

    this.earnCoins(achievementReward)
  }

  earnCoins(newCoins: number): void {
    this.props.coins = this.props.coins.increment(newCoins)
  }

  loseCoins(coins: number): void {
    this.props.coins = this.props.coins.dencrement(coins)
  }

  earnXp(newXp: number) {
    this.props.level = this.level.up(this.xp.value, newXp)
    this.props.xp = this.props.xp.increment(newXp)
    this.notifyChanges()
  }

  earnLastWeekRankingPositionReward(): void {
    if (!this.props.lastWeekRankingPosition) return

    const reward = this.rewardByLastWeekRankingPosition
    this.earnCoins(reward)
  }

  canBuy(coins: number): Logical {
    return Logical.create(this.props.coins.value >= coins)
  }

  buyRocket(rocket: Rocket): void {
    if (this.hasAcquiredRocket(rocket.id)) {
      this.selectRocket(rocket)
      return
    }

    if (this.canBuy(rocket.price.value).isTrue) {
      this.loseCoins(rocket.price.value)
      this.selectRocket(rocket)
      this.props.acquiredRocketsIds.add(rocket.id)
      this.notifyChanges()
    }
  }

  buyAvatar(avatar: Avatar): void {
    if (this.hasAcquiredAvatar(avatar.id)) {
      this.selectAvatar(avatar)
      return
    }

    if (this.canBuy(avatar.price.value).isTrue) {
      this.loseCoins(avatar.price.value)
      this.selectAvatar(avatar)
      this.props.acquiredAvatarsIds.add(avatar.id)
      this.notifyChanges()
    }
  }

  unlockChallengeSolutions(challengeId: string) {
    if (this.hasCompletedChallenge(challengeId).isFalse) {
      this.loseCoins(10)
    }
  }

  makeTodayStatusDone() {
    if (this.weekStatus.todayStatus !== 'todo') return

    this.props.weekStatus = this.weekStatus.updateTodayStatus('done')
    this.props.streak = this.streak.increment(1)
    return {
      newStreak: this.props.streak,
      newWeekStatus: this.props.weekStatus,
    }
  }

  breakStreak() {
    this.props.streak = Integer.create(0)
    this.props.didBreakStreak = this.props.didBreakStreak.makeTrue()
    this.props.weekStatus = this.props.weekStatus.updateTodayStatus('undone')
  }

  resetStreak() {
    this.props.didBreakStreak = this.didBreakStreak.makeFalse()
  }

  getAchievementCount(metric: AchievementMetricValue) {
    return this[metric]
  }

  selectRocket(rocket: Rocket): void {
    this.props.rocket = {
      id: rocket.id,
      entity: rocket,
    }
  }

  selectAvatar(avatar: Avatar): void {
    this.props.avatar = {
      id: avatar.id,
      entity: avatar,
    }
  }

  seeRankingResult() {
    this.props.canSeeRankingResult = this.props.canSeeRankingResult.invertValue()
  }

  resetRankingLoserState() {
    this.props.lastWeekRankingPosition = null
  }

  hasUnlockedAchievement(achievementId: string): boolean {
    return this.props.unlockedAchievementsIds.includes(achievementId).isTrue
  }

  hasRescuableAchievement(achievementId: string): boolean {
    return this.props.rescuableAchievementsIds.includes(achievementId).isTrue
  }

  hasUnlockedStar(starId: string): Logical {
    return this.props.unlockedStarsIds.includes(starId)
  }

  hasCompletedChallenge(challengeId: string): Logical {
    return this.props.completedChallengesIds.includes(challengeId)
  }

  hasUpvotedComment(commentId: string): Logical {
    return this.props.upvotedCommentsIds.includes(commentId)
  }

  hasUpvotedSolution(solutionId: string) {
    return this.props.upvotedSolutionsIds.includes(solutionId)
  }

  hasAcquiredRocket(rocketId: string): boolean {
    return this.props.acquiredRocketsIds.includes(rocketId).isTrue
  }

  hasAcquiredAvatar(rocketId: string): boolean {
    return this.props.acquiredAvatarsIds.includes(rocketId).isTrue
  }

  isSelectRocket(rocketId: string): boolean {
    return rocketId === this.rocketId
  }

  isSelectAvatar(avatarId: string): boolean {
    return avatarId === this.avatarId
  }

  upvoteComment(comment: Comment): void {
    comment.upvote()
    this.props.upvotedCommentsIds = this.props.upvotedCommentsIds.add(comment.id)
  }

  removeUpvoteComment(comment: Comment): void {
    comment.removeUpvote()
    this.props.upvotedCommentsIds = this.props.upvotedCommentsIds.remove(comment.id)
  }

  upvoteSolution(solution: Solution): void {
    solution.upvote()
    this.props.upvotedSolutionsIds = this.props.upvotedSolutionsIds.add(solution.id)
  }

  removeUpvoteSolution(solution: Solution): void {
    solution.removeUpvote()
    this.props.upvotedSolutionsIds = this.props.upvotedSolutionsIds.remove(solution.id)
  }

  completeChallenge(challenge: Challenge): void {
    this.props.completedChallengesIds = this.props.completedChallengesIds.add(
      challenge.id,
    )
  }

  private notifyChanges(): void {
    if (this.props._observer) this.props._observer.callback()
  }

  set observer(observer: Observer) {
    this.props._observer = observer
  }

  get canMakeTodayStatusDone(): Logical {
    return Logical.create(this.weekStatus.todayStatus === 'todo')
  }

  get hasCompletedSpace(): Logical {
    return Logical.create(this.props.completedPlanetsIds.length === PLANETS_COUNT)
  }

  get unlockedStarsCount() {
    return Integer.create(this.props.unlockedStarsIds.length - 1)
  }

  get acquiredRocketsCount() {
    return Integer.create(this.props.acquiredRocketsIds.length - 1)
  }

  get acquiredAvatarsCount() {
    return Integer.create(this.props.acquiredAvatarsIds.length - 3)
  }

  get unlockedAchievementsCount() {
    return Integer.create(this.props.unlockedAchievementsIds.length)
  }

  get rescueableAchievementsCount() {
    return Integer.create(this.props.rescuableAchievementsIds.length)
  }

  get completedChallengesCount() {
    return Integer.create(this.props.completedChallengesIds.length)
  }

  get completedPlanetsCount() {
    return Integer.create(this.props.completedPlanetsIds.length)
  }

  get isRankingWinner(): boolean {
    if (!this.props.lastWeekRankingPosition) return false

    return this.props.lastWeekRankingPosition.isInWinningArea
  }

  get isTopRankingWinner(): boolean {
    if (!this.props.lastWeekRankingPosition) return false

    return this.props.lastWeekRankingPosition.isInPodiumArea
  }

  get hasNextTier(): boolean {
    if (!this.props.lastWeekRankingPosition) return false
    return this.tier.position.value !== this.props.lastWeekRankingPosition.position.value
  }

  get rewardByLastWeekRankingPosition() {
    if (!this.props.lastWeekRankingPosition) return 0

    return this.props.lastWeekRankingPosition.getReward(this.tier.reward.value)
  }

  get email() {
    return this.props.email
  }

  get slug() {
    return this.props.slug
  }

  get avatarId() {
    return this.props.avatar.id
  }

  get avatar() {
    if (!this.props.avatar.entity) {
      throw new EntityNotDefinedError('Avatar')
    }
    return this.props.avatar.entity
  }

  get rocketId() {
    return this.props.rocket.id
  }

  get rocket() {
    if (!this.props.rocket.entity) {
      throw new EntityNotDefinedError('Foguete')
    }
    return this.props.rocket.entity
  }

  get tierId() {
    return this.props.tier.id
  }

  get tier() {
    if (!this.props.tier.entity) {
      throw new EntityNotDefinedError('Tier')
    }
    return this.props.tier.entity
  }

  get name() {
    return this.props.name
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

  get dto(): UserDto {
    return {
      id: this.id,
      slug: this.slug.value,
      email: this.email.value,
      name: this.name.value,
      rocket: {
        id: this.rocketId,
        dto: this.props.rocket.entity?.dto,
      },
      avatar: {
        id: this.avatarId,
        dto: this.props.avatar.entity?.dto,
      },
      tier: {
        id: this.tierId,
        dto: this.props.tier.entity?.dto,
      },
      level: this.level.number.value,
      coins: this.coins.value,
      xp: this.xp.value,
      weeklyXp: this.weeklyXp.value,
      streak: this.streak.value,
      weekStatus: this.props.weekStatus.value,
      unlockedStarsIds: this.props.unlockedStarsIds.items,
      acquiredRocketsIds: this.props.acquiredRocketsIds.items,
      acquiredAvatarsIds: this.props.acquiredAvatarsIds.items,
      unlockedAchievementsIds: this.props.unlockedAchievementsIds.items,
      rescuableAchievementsIds: this.props.rescuableAchievementsIds.items,
      unlockedDocsIds: this.props.unlockedDocsIds.items,
      completedChallengesIds: this.props.completedChallengesIds.items,
      completedPlanetsIds: this.props.completedPlanetsIds.items,
      canSeeRankingResult: this.props.canSeeRankingResult.value,
      lastWeekRankingPosition: this.props.lastWeekRankingPosition?.position.value ?? null,
      didBreakStreak: this.props.didBreakStreak.value,
      hasCompletedSpace: this.hasCompletedSpace.value,
      createdAt: this.createdAt,
    }
  }
}
