import { Entity } from '#global/abstracts'
import { Image, Integer, Name, OrdinalNumber } from '#global/structs'
import type { TierDto } from '#ranking/dtos'
import { TIERS_COUNT } from '#ranking/constants'

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
    return this.position.value === 0
  }

  get isLastTier() {
    return this.position.value === TIERS_COUNT
  }

  get hasNextTier() {
    return this.position.value <= TIERS_COUNT
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
