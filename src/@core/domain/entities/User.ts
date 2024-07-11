import type { UserDTO } from '../../dtos/UserDTO'
import { BaseEntity } from '../abstracts'
import { Count, Level } from '../structs'
import { Email } from '../structs/Email'
import { Name } from '../structs/Name'
import { Slug } from '../structs/Slug'
import { Avatar } from './Avatar'
import { Ranking } from './Ranking'
import { Rocket } from './Rocket'

type UserProps = {
  id?: string
  avatar: Avatar
  ranking: Ranking
  rocket: Rocket
  slug: Slug
  email: Email
  name: Name
  level: Level
  coins: Count
  xp: Count
  weeklyXp: Count
  streak: number
  unlockedStarsCount: Count
  acquiredRocketsCount: Count
  unlockedAchievementsCount: Count
  completedChallengesCount: Count
  completedPlanetsCount: Count
}

export class User extends BaseEntity {
  private props: UserProps

  private constructor(props: UserProps) {
    super(props?.id)
    this.props = props
  }

  static create(dto: UserDTO): User {
    return new User({
      level: Level.create(dto.level),
      email: Email.create(dto.email),
      slug: Slug.create(dto.slug),
      name: Name.create(dto.name),
      rocket: Rocket.create(dto.rocket),
      avatar: Avatar.create(dto.avatar),
      ranking: Ranking.create(dto.ranking),
      coins: Count.create({ key: 'coins', value: dto.coins }),
      xp: Count.create({ key: 'xp', value: dto.xp }),
      weeklyXp: Count.create({ key: 'weeklyXp', value: dto.weeklyXp }),
      unlockedAchievementsCount: Count.create({
        key: 'unlockedAchievementsCount',
        value: dto.unlockedAchievementsCount,
      }),
      acquiredRocketsCount: Count.create({
        key: 'acquiredRocketsCount',
        value: dto.acquiredRocketsCount,
      }),
      unlockedStarsCount: Count.create({
        key: 'unlockedStarsCount',
        value: dto.unlockedStarsCount,
      }),
      completedChallengesCount: Count.create({
        key: 'completedChallengesCount',
        value: dto.completedChallengesCount,
      }),
      completedPlanetsCount: Count.create({
        key: 'completedPlanetsCount',
        value: dto.completedPlanetsCount,
      }),
      streak: dto.streak,
    })
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
      streak: this.streak,
      unlockedStarsCount: this.unlockedStarsCount.value,
      acquiredRocketsCount: this.acquiredRocketsCount.value,
      unlockedAchievementsCount: this.unlockedAchievementsCount.value,
      completedChallengesCount: this.completedChallengesCount.value,
      completedPlanetsCount: this.completedPlanetsCount.value,
    }
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

  get unlockedStarsCount() {
    return this.props.unlockedStarsCount
  }
  get acquiredRocketsCount() {
    return this.props.acquiredRocketsCount
  }
  get unlockedAchievementsCount() {
    return this.props.unlockedAchievementsCount
  }
  get completedChallengesCount() {
    return this.props.completedChallengesCount
  }
  get completedPlanetsCount() {
    return this.props.completedPlanetsCount
  }
}
