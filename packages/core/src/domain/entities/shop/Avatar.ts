import type { AvatarDto } from '#dtos'
import { Entity } from '#domain/abstracts'
import { Image, Integer, Name } from '#domain/structs'

export type AvatarProps = {
  id?: string
  name: Name
  price: Integer
  image: Image
}

export class Avatar extends Entity<AvatarProps> {
  static create(dto: AvatarDto): Avatar {
    return new Avatar(
      {
        name: Name.create(dto.name),
        price: Integer.create('price', dto.price),
        image: Image.create(dto.image),
      },
      dto?.id,
    )
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

  get dto(): AvatarDto {
    return {
      id: this.id,
      name: this.name.value,
      price: this.price.value,
      image: this.image.value,
    }
  }
}
