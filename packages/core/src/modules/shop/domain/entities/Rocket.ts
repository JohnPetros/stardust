import { Entity } from '#global/abstracts'
import { Image, Integer, Name } from '#global/structs'
import type { RocketDto } from '#shop/dtos'

type RocketProps = {
  name: Name
  price: Integer
  image: Image
}

export class Rocket extends Entity<RocketProps> {
  static create(dto: RocketDto): Rocket {
    return new Rocket(
      {
        name: Name.create(dto.name),
        price: Integer.create('price', dto.price),
        image: Image.create(dto.image),
      },
      dto.id,
    )
  }

  get name() {
    return this.props.name
  }

  get image() {
    return this.props.image
  }

  get price() {
    return this.props.price
  }

  get dto(): RocketDto {
    return {
      id: this.id,
      name: this.name.value,
      price: this.price.value,
      image: this.image.value,
    }
  }
}
