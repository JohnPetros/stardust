import { Entity } from '../../../global/domain/abstracts'
import { Image, Integer, Name, Slug } from '#global/structs'
import { RankingPosition } from '../structs'
import type { RankingUserDto } from '../../dtos'

type RankingUserProps = {
  name: Name
  slug: Slug
  xp: Integer
  avatar: {
    image: Image
    name: Name
  }
  rankingPosition: RankingPosition
  tierId: string
}

export class RankingUser extends Entity<RankingUserProps> {
  static create(dto: RankingUserDto) {
    return new RankingUser(
      {
        slug: Slug.create(dto.slug),
        avatar: {
          image: Image.create(dto.avatar.image),
          name: Name.create(dto.avatar.name),
        },
        name: Name.create(dto.name),
        xp: Integer.create(dto.xp, 'Xp do usuário do ranking'),
        rankingPosition: RankingPosition.create(dto.position),
        tierId: dto.tierId,
      },
      dto.id,
    )
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

  get avatar() {
    return this.props.avatar
  }

  get dto(): RankingUserDto {
    return {
      id: this.id,
      name: this.props.name.value,
      slug: this.props.slug.value,
      xp: this.xp.value,
      avatar: {
        name: this.avatar.name.value,
        image: this.avatar.image.value,
      },
      tierId: this.props.tierId,
      position: this.props.rankingPosition.position.value,
    }
  }
}
