import { UserDTO } from '../../dtos/UserDTO'
import { Email } from '../structs/Email'
import { Name } from '../structs/Name'
import { Slug } from '../structs/Slug'
import { BaseEntity } from './BaseEntity'

type UserProps = {
  id?: string
  slug: Slug
  email: Email
  name: Name
  level: number
  coins: number
  xp: number
  weeklyXp: number
  streak: number
  avatarId: string
  rankingId: string
  rocketId: string
}

export class User extends BaseEntity {
  private props: UserProps

  private constructor(props: UserProps) {
    super(props?.id)
    this.props = props
  }

  static create(dto: UserDTO): User {
    return new User({
      ...dto,
      level: dto.level ?? 1,
      email: Email.create(dto.email),
      slug: Slug.create(dto.slug),
      name: Name.create(dto.name),
    })
  }

  get dto(): UserDTO {
    return {
      id: this.id,
      slug: this.slug.value,
      email: this.email.value,
      name: this.name.value,
      level: this.level,
      coins: this.coins,
      xp: this.xp,
      streak: this.streak,
      avatarId: this.avatarId,
      rocketId: this.rocketId,
      rankingId: this.rocketId,
      weeklyXp: this.weeklyXp,
    }
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get coins() {
    return this.props.coins
  }

  get slug() {
    return this.props.slug
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

  get avatarId() {
    return this.props.avatarId
  }

  get rocketId() {
    return this.props.rocketId
  }

  get rankingId() {
    return this.props.rankingId
  }
}
