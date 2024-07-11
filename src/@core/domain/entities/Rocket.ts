import { BuyableItem } from '../abstracts'
import type { RocketDTO } from '@/@core/dtos'

type RocketProps = {
  id?: string
  image: string
  name: string
  price: number
  slug: string
}

export class Rocket extends BuyableItem {
  private props: RocketProps

  private constructor(props: RocketProps) {
    super(props.price, props?.id)
    this.props = props
  }

  static create(dto: RocketDTO): Rocket {
    return new Rocket({
      ...dto,
    })
  }

  get dto() {
    return {
      ...this.props,
    }
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
}
