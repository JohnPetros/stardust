import { Entity } from '../../../global/domain/abstracts'
import {
  Image,
  Integer,
  Logical,
  Name,
  OrdinalNumber,
} from '../../../global/domain/structures'
import type { TierDto } from '../../dtos'
import { TIERS_COUNT } from '../constants'

type TierProps = {
  name: Name
  image: Image
  position: OrdinalNumber
  reward: Integer
}

export class Tier extends Entity<TierProps> {
  static create(dto: TierDto): Tier {
    return new Tier(
      {
        name: Name.create(dto.name),
        position: OrdinalNumber.create(dto.position, 'Posição do tier'),
        reward: Integer.create(dto.reward, 'Recompensa do tier'),
        image: Image.create(dto.image),
      },
      dto?.id,
    )
  }

  get isFirstTier() {
    return Logical.create(this.position.value === 0)
  }

  get isLastTier() {
    return Logical.create(this.position.value === TIERS_COUNT)
  }

  get hasNextTier() {
    return Logical.create(this.position.value <= TIERS_COUNT)
  }

  get position() {
    return this.props.position
  }

  get name() {
    return this.props.name
  }

  get image() {
    return this.props.image
  }

  get reward() {
    return this.props.reward
  }

  get dto(): TierDto {
    return {
      id: this.id,
      name: this.name.value,
      position: this.position.value,
      reward: this.reward.value,
      image: this.image.value,
    }
  }
}
