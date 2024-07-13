import type { RocketDTO } from '@/@core/dtos'
import { BaseEntity } from '../abstracts'
import { Integer, Name, Slug } from '../structs'

type RocketProps = {
  id?: string
  name: Name
  slug: Slug
  price: Integer
  image: string
}

export class Rocket extends BaseEntity {
  private props: RocketProps

  private constructor(props: RocketProps) {
    super(props?.id)
    this.props = props
  }

  static create(dto: RocketDTO): Rocket {
    return new Rocket({
      id: dto.id,
      name: Name.create(dto.name),
      slug: Slug.create(dto.slug),
      price: Integer.create('price', dto.price),
      image: dto.image,
    })
  }

  get name() {
    return this.props.name
  }

  get image() {
    return this.props.image
  }

  get slug() {
    return this.props.slug
  }

  get price() {
    return this.props.price
  }

  get dto(): RocketDTO {
    return {
      id: this.id,
      name: this.name.value,
      slug: this.slug.value,
      price: this.price.value,
      image: this.image,
    }
  }
}
