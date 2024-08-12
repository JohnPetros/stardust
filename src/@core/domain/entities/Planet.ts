import type { PlanetDTO } from '@/@core/dtos'

import { BaseEntity } from '../abstracts'
import { Image, Name, OrdinalNumber } from '../structs'
import { Star } from './Star'

type PlanetProps = {
  id?: string
  name: Name
  icon: Image
  image: Image
  position: OrdinalNumber
  stars: Star[]
}

export class Planet extends BaseEntity {
  private props: PlanetProps

  private constructor(props: PlanetProps) {
    super(props.id)
    this.props = props
  }

  static create(dto: PlanetDTO) {
    return new Planet({
      name: Name.create(dto.name),
      icon: Image.create(dto.icon),
      image: Image.create(dto.image),
      position: OrdinalNumber.create('planet position', dto.position),
      stars: dto.stars.map(Star.create),
      id: dto?.id,
    })
  }

  getNextStar(starId: string): Star | null {
    const currentStar = this.stars.find((star) => star.id === starId)
    const nextStar = this.stars.find(
      (star) => star.number.value === currentStar?.number.incrementOne().value,
    )
    return nextStar ?? null
  }

  get name() {
    return this.props.name
  }

  get image() {
    return this.props.image
  }

  get icon() {
    return this.props.icon
  }

  get position() {
    return this.props.position
  }

  get stars() {
    return this.props.stars
  }

  get dto(): PlanetDTO {
    return {
      id: this.id,
      name: this.name.value,
      image: this.image.value,
      icon: this.icon.value,
      position: this.position.value,
      stars: this.stars.map((star) => star.dto),
    }
  }
}
