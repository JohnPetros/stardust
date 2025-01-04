import { Entity } from '#global/abstracts'
import { Image, Name, OrdinalNumber } from '#global/structs'
import type { PlanetDto } from '#space/dtos'
import { EmptyPlanetError } from '#space/errors'
import { Star } from './Star'

type PlanetProps = {
  name: Name
  icon: Image
  image: Image
  position: OrdinalNumber
  stars: Star[]
}

export class Planet extends Entity<PlanetProps> {
  static create(dto: PlanetDto) {
    return new Planet(
      {
        name: Name.create(dto.name),
        icon: Image.create(dto.icon),
        image: Image.create(dto.image),
        position: OrdinalNumber.create(dto.position, 'Posição do planeta'),
        stars: dto.stars.map(Star.create),
      },
      dto.id,
    )
  }

  getNextStar(starId: string): Star | null {
    const currentStar = this.stars.find((star) => star.id === starId)
    const nextStar = this.stars.find(
      (star) => star.number.value === currentStar?.number.incrementOne().value,
    )
    return nextStar ?? null
  }

  get firstStar() {
    const firstStar = this.stars[0]
    if (!firstStar) throw new EmptyPlanetError(this.name.value)
    return firstStar
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

  get dto(): PlanetDto {
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
