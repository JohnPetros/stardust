import type { PlanetDTO } from '@/@core/dtos'

import { BaseEntity } from '../abstracts'
import { Name } from '../structs'
import { Star } from './Star'

type PlanetProps = {
  id?: string
  name: Name
  icon: string
  image: string
  position: number
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
      icon: dto.icon,
      image: dto.image,
      position: dto.position,
      stars: dto.stars.map(Star.create),
      id: dto?.id,
    })
  }

  get dto(): PlanetDTO {
    return {
      id: this.id,
      name: this.name.value,
      image: this.image,
      icon: this.icon,
      position: this.position,
      stars: this.stars.map((star) => star.dto),
    }
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
}
