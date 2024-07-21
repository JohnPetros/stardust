import type { TierDTO } from '@/@core/dtos'
import { BaseEntity } from '../abstracts'
import { Image, Integer, Name, OrdinalNumber } from '../structs'

type TierProps = {
  id?: string
  name: Name
  image: Image
  position: OrdinalNumber
  reward: Integer
}

export class Tier extends BaseEntity {
  private props: TierProps

  private constructor(props: TierProps) {
    super(props?.id)
    this.props = props
  }

  static create(dto: TierDTO): Tier {
    return new Tier({
      name: Name.create(dto.name),
      position: OrdinalNumber.create('Tier position', dto.position),
      reward: Integer.create('Tier reward', dto.reward),
      image: Image.create(dto.image),
      id: dto?.id,
    })
  }

  get dto(): TierDTO {
    return {
      id: this.id,
      name: this.name.value,
      position: this.position.value,
      reward: this.reward.value,
      image: this.image.value,
    }
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

  get position() {
    return this.props.position
  }
}