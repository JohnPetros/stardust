import type { AvatarDTO } from '@/@core/dtos'
import { Integer, Name } from '../structs'
import { BaseEntity } from '../abstracts'

export type AvatarProps = {
  id?: string
  name: Name
  price: Integer
  image: string
}

export class Avatar extends BaseEntity {
  private props: AvatarProps

  private constructor(props: AvatarProps) {
    super(props?.id)
    this.props = props
  }

  static create(dto: AvatarDTO): Avatar {
    return new Avatar({
      name: Name.create(dto.name),
      price: Integer.create('price', dto.price),
      image: dto.image,
      id: dto?.id,
    })
  }

  get name() {
    return this.props.name
  }

  get price() {
    return this.props.price
  }

  get image() {
    return this.props.image
  }

  get dto(): AvatarDTO {
    return {
      id: this.id,
      name: this.name.value,
      price: this.price.value,
      image: this.image,
    }
  }
}
