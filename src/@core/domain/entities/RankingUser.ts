import type { RankingUserDTO } from '@/@core/dtos'
import { BaseEntity } from '../abstracts'
import { Image, Integer, Name, RankingPosition, Slug } from '../structs'

type RankingUserProps = {
  id?: string
  name: Name
  slug: Slug
  xp: Integer
  avatarImage: Image
  rankingPosition: RankingPosition
  tierId: string
}

export class RankingUser extends BaseEntity {
  private props: RankingUserProps

  private constructor(props: RankingUserProps) {
    super(props.id)
    this.props = props
  }

  static create(dto: RankingUserDTO, position: number) {
    return new RankingUser({
      id: dto.id,
      slug: Slug.create(dto.slug),
      avatarImage: Image.create(dto.avatarImage),
      name: Name.create(dto.name),
      xp: Integer.create('ranking user xp', dto.xp),
      rankingPosition: RankingPosition.create(position),
      tierId: dto.tierId,
    })
  }

  get rankingPosition() {
    return this.props.rankingPosition
  }

  get xp() {
    return this.props.xp
  }

  get name() {
    return this.props.name
  }

  get avatarImage() {
    return this.props.avatarImage
  }

  get dto(): RankingUserDTO {
    return {
      id: this.id,
      name: this.props.name.value,
      slug: this.props.slug.value,
      xp: this.xp.value,
      avatarImage: this.props.avatarImage.value,
      tierId: this.props.tierId,
    }
  }
}
