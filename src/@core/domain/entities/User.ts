import type { UserDTO } from '../../dtos/UserDTO'
import { UserFactory } from '../../factories'
import {
  type OrdinalNumber,
  type Email,
  type IdsCollection,
  type Name,
  type Slug,
  type Observer,
  Integer,
  Logical,
} from '../structs'
import type { Avatar } from './Avatar'
import type { Ranking } from './Ranking'
import type { Rocket } from './Rocket'
import { BaseEntity } from '../abstracts'

type UserProps = {
  id?: string
  avatar: Avatar
  ranking: Ranking
  rocket: Rocket
  slug: Slug
  email: Email
  name: Name
  level: OrdinalNumber
  coins: Integer
  xp: Integer
  weeklyXp: Integer
  streak: Integer
  unlockedStarsIds: IdsCollection
  acquiredRocketsIds: IdsCollection
  unlockedAchievementsIds: IdsCollection
  rescuableAchievementsIds: IdsCollection
  completedChallengesIds: IdsCollection
  completedPlanetsIds: IdsCollection
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

  hasUnlockedAchievement(achievementId: string) {
    return this.props.unlockedAchievementsIds.includes(achievementId)
  }

  hasRescuableAchievement(achievementId: string) {
    return this.props.rescuableAchievementsIds.includes(achievementId)
  }

  hasUnlockedStar(starId: string) {
    return this.props.unlockedStarsIds.includes(starId)
  }

  hasCompletedChallenge(challengeId: string) {
    return this.props.completedChallengesIds.includes(challengeId)
  }

  hasAcquiredRocket(rocketId: string) {
    return this.props.acquiredRocketsIds.includes(rocketId)
  }

  isSelectRocket(rocketId: string) {
    return rocketId === this.rocket.id
  }

  unlockAchievement(achievementId: string) {
    this.props.unlockedAchievementsIds.add(achievementId)
    this.props.rescuableAchievementsIds.add(achievementId)

    this.notifyChanges()
  }

  rescueAchievement(achievementId: string, achievementReward: number) {
    this.props.rescuableAchievementsIds =
      this.props.rescuableAchievementsIds.remove(achievementId)

    this.earnCoins(achievementReward)
  }

  earnCoins(newCoins: number) {
    this.props.coins = this.props.coins.increment(newCoins)
    this.notifyChanges()
  }

  loseCoins(coins: number) {
    this.props.coins = this.props.coins.dencrement(coins)
  }

  canBuy(coins: number) {
    return this.props.coins.value >= coins
  }

  buyRocket(rocket: Rocket) {
    if (this.hasAcquiredRocket(rocket.id)) {
      this.selectRocket(rocket)
      this.notifyChanges()
      return
    }

    if (this.canBuy(rocket.price.value)) {
      this.loseCoins(rocket.price.value)
      this.selectRocket(rocket)
      this.props.acquiredRocketsIds.add(rocket.id)
      this.notifyChanges()
    }
  }

  getAchievementCount(metric: AchievementMetricValue) {
    return this[metric]
  }

  private notifyChanges() {
    if (this.props._observer) this.props._observer.callback()
  }

  selectRocket(rocket: Rocket) {
    this.props.rocket = rocket
  }

  set observer(observer: Observer) {
    this.props._observer = observer
  }

  get unlockedStarsCount() {
    return Integer.create('unlocked stars', this.props.unlockedStarsIds.value.length - 1)
  }

  get acquiredRocketsCount() {
    return Integer.create(
      'acquired rockets count',
      this.props.acquiredRocketsIds.value.length - 1
    )
  }

  get unlockedAchievementsCount() {
    return Integer.create(
      'unlocked achievements',
      this.props.unlockedAchievementsIds.value.length
    )
  }

  get rescueableAchievementsCount() {
    return Integer.create(
      'rescuable achievements',
      this.props.rescuableAchievementsIds.value.length
    )
  }

  get completedChallengesCount() {
    return Integer.create(
      'completed challenges',
      this.props.completedChallengesIds.value.length
    )
  }

  get completedPlanetsCount() {
    return Integer.create(
      'completed planets',
      this.props.completedPlanetsIds.value.length
    )
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

  get ranking() {
    return this.props.ranking
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

  get streak() {
    return this.props.streak
  }

  get level() {
    return this.props.level
  }

  get dto(): UserDTO {
    return {
      id: this.id,
      slug: this.slug.value,
      email: this.email.value,
      name: this.name.value,
      ranking: this.ranking.dto,
      rocket: this.rocket.dto,
      avatar: this.avatar.dto,
      level: this.level.value,
      coins: this.coins.value,
      xp: this.xp.value,
      weeklyXp: this.weeklyXp.value,
      streak: this.streak.value,
      unlockedStarsIds: this.props.unlockedStarsIds.value,
      acquiredRocketsIds: this.props.acquiredRocketsIds.value,
      unlockedAchievementsIds: this.props.unlockedAchievementsIds.value,
      rescuableAchievementsIds: this.props.rescuableAchievementsIds.value,
      completedChallengesIds: this.props.completedChallengesIds.value,
      completedPlanetsIds: this.props.completedPlanetsIds.value,
    }
  }
}
