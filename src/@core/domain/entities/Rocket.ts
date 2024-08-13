import type { RocketDTO } from '@/@core/dtos'
import { Entity } from '../abstracts'
import { Image, Integer, Name } from '../structs'

type RocketProps = {
  name: Name
  price: Integer
  image: Image
}

export class Rocket extends Entity<RocketProps> {
  static create(dto: RocketDTO): Rocket {
    return new Rocket({
      name: Name.create(dto.name),
      price: Integer.create('price', dto.price),
      image: Image.create(dto.image),
    }, dto.id)
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

  get dto(): RocketDTO {
    return {
      id: this.id,
      name: this.name.value,
      price: this.price.value,
      image: this.image.value,
    }
  }
}
