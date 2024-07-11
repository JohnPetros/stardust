import type { RocketDTO } from '@/@core/dtos'
import { BuyableItem } from '../abstracts'
import { Count, Name, Slug } from '../structs'

type RocketProps = {
  id?: string
  image: string
  name: Name
  slug: Slug
  price: Count
}

export class Rocket extends BuyableItem {
  private props: RocketProps

  private constructor(props: RocketProps) {
    super(props.price.value, props?.id)
    this.props = props
  }

  static create(dto: RocketDTO): Rocket {
    return new Rocket({
      ...dto,
      id: dto.id,
      name: Name.create(dto.name),
      slug: Slug.create(dto.slug),
      price: Count.create({ key: 'price', value: dto.price }),
      image: dto.image,
    })
  }

  get dto(): RocketDTO {
    return {
      id: this.id,
      image: this.image,
      name: this.name.value,
      slug: this.slug.value,
      price: this.price,
    }
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
}
