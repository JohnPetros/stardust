import type { AvatarDTO } from '@/@core/dtos'
import { BuyableItem } from '../abstracts'

export type AvatarProps = {
  id?: string
  image: string
  name: string
  price: number
}

export class Avatar extends BuyableItem {
  private props: AvatarProps

  private constructor(props: AvatarProps) {
    super(props.price, props.id)
    this.props = props
  }

  static create(dto: AvatarDTO): Avatar {
    return new Avatar({
      name: dto.name,
      image: dto.image,
      price: dto.price,
      id: dto?.id,
    })
  }

  get dto(): AvatarDTO {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      price: this.price,
    }
  }

  get name() {
    return this.props.name
  }

  get image() {
    return this.props.image
  }
}
