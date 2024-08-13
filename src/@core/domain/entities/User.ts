import type { UserDTO } from '../../dtos/UserDTO'
import { UserFactory } from '../../factories'
import {
  type Email,
  type Name,
  type Slug,
  type Observer,
  type RankingPosition,
  Logical,
  Integer,
  type List,
} from '../structs'
import type { Avatar } from './Avatar'
import type { Rocket } from './Rocket'
import { BaseEntity } from '../abstracts'
import type { Tier } from './Tier'
import type { AchievementMetricValue } from '../types'
import type { WeekStatus } from '../structs/WeekStatus'
import type { Level } from '../structs/Level'

type UserProps = {
  id?: string
  avatar: Avatar
  tier: Tier
  rocket: Rocket
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
  canSeeRankingResult: Logical
  didIncrementStreakOnSaturday: Logical
  lastWeekRankingPosition: RankingPosition | null
  createdAt: Date
  _observer?: Observer
}

export class User extends BaseEntity {
  private props: UserProps

  private constructor(props: UserProps) {
    super(props?.id)
    this.props = props
  }

  static create(dto: UserDTO): User {
    return new User(UserFactory.produce(dto))
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

  canBuy(coins: number): boolean {
    return this.props.coins.value >= coins
  }

  buyRocket(rocket: Rocket): void {
    if (this.hasAcquiredRocket(rocket.id)) {
      this.selectRocket(rocket)
      return
    }

    if (this.canBuy(rocket.price.value)) {
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

    if (this.canBuy(avatar.price.value)) {
      this.loseCoins(avatar.price.value)
      this.selectAvatar(avatar)
      this.props.acquiredAvatarsIds.add(avatar.id)
      this.notifyChanges()
    }
  }

  makeTodayStatusDone() {
    if (this.weekStatus.todayStatus !== 'todo') return

    this.props.weekStatus = this.weekStatus.updateTodayStatus('done')
    this.props.streak = this.streak.increment(1)
    this.notifyChanges()
  }

  getAchievementCount(metric: AchievementMetricValue) {
    return this[metric]
  }

  selectRocket(rocket: Rocket): void {
    this.props.rocket = rocket
  }

  selectAvatar(Avatar: Avatar): void {
    this.props.avatar = Avatar
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

  hasUnlockedDoc(docId: string): Logical {
    return this.props.unlockedDocsIds.includes(docId)
  }

  hasAcquiredRocket(rocketId: string): boolean {
    return this.props.acquiredRocketsIds.includes(rocketId).isTrue
  }

  hasAcquiredAvatar(rocketId: string): boolean {
    return this.props.acquiredAvatarsIds.includes(rocketId).isTrue
  }

  isSelectRocket(rocketId: string): boolean {
    return rocketId === this.rocket.id
  }

  isSelectAvatar(avatarId: string): boolean {
    return avatarId === this.avatar.id
  }

  private notifyChanges(): void {
    if (this.props._observer) this.props._observer.callback()
  }

  set observer(observer: Observer) {
    this.props._observer = observer
  }

  get canMakeTodayStatusDone(): Logical {
    return Logical.create(
      'Can make today status done?',
      this.weekStatus.todayStatus === 'todo',
    )
  }

  get unlockedStarsCount() {
    return Integer.create('unlocked stars', this.props.unlockedStarsIds.length - 1)
  }

  get acquiredRocketsCount() {
    return Integer.create(
      'acquired rockets count',
      this.props.acquiredRocketsIds.length - 1,
    )
  }

  get acquiredAvatarsCount() {
    return Integer.create(
      'acquired avatars count',
      this.props.acquiredAvatarsIds.length - 3,
    )
  }

  get unlockedAchievementsCount() {
    return Integer.create(
      'unlocked achievements',
      this.props.unlockedAchievementsIds.length,
    )
  }

  get rescueableAchievementsCount() {
    return Integer.create(
      'rescuable achievements',
      this.props.rescuableAchievementsIds.length,
    )
  }

  get completedChallengesCount() {
    return Integer.create(
      'completed challenges',
      this.props.completedChallengesIds.length,
    )
  }

  get completedPlanetsCount() {
    return Integer.create('completed planets', this.props.completedPlanetsIds.length)
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

    return (
      this.props.tier.position.value !== this.props.lastWeekRankingPosition.position.value
    )
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

  get canSeeRankingResult() {
    return this.props.canSeeRankingResult
  }

  get lastWeekRankingPosition() {
    return this.props.lastWeekRankingPosition
  }

  get createdAt() {
    return this.props.createdAt
  }

  get dto(): UserDTO {
    return {
      id: this.id,
      slug: this.slug.value,
      email: this.email.value,
      name: this.name.value,
      tier: this.tier.dto,
      rocket: this.rocket.dto,
      avatar: this.avatar.dto,
      level: this.level.number.value,
      coins: this.coins.value,
      xp: this.xp.value,
      weeklyXp: this.weeklyXp.value,
      streak: this.streak.value,
      weekStatus: this.props.weekStatus.statuses,
      unlockedStarsIds: this.props.unlockedStarsIds.items,
      acquiredRocketsIds: this.props.acquiredRocketsIds.items,
      acquiredAvatarsIds: this.props.acquiredAvatarsIds.items,
      unlockedAchievementsIds: this.props.unlockedAchievementsIds.items,
      rescuableAchievementsIds: this.props.rescuableAchievementsIds.items,
      completedChallengesIds: this.props.completedChallengesIds.items,
      completedPlanetsIds: this.props.completedPlanetsIds.items,
      canSeeRankingResult: this.props.canSeeRankingResult.value,
      lastWeekRankingPosition: this.props.lastWeekRankingPosition?.position.value ?? null,
      didIncrementStreakOnSaturday: this.props.didIncrementStreakOnSaturday.value,
      createdAt: this.createdAt.toDateString(),
    }
  }
}
