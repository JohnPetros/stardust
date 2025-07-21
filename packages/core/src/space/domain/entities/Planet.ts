import { Entity } from '#global/domain/abstracts/index'
import { Name, Image, OrdinalNumber, Integer } from '#global/domain/structures/index'
import type { PlanetDto } from './dtos'
import { EmptyPlanetError } from '../errors'
import { Star } from './Star'

type PlanetProps = {
  name: Name
  icon: Image
  image: Image
  position: OrdinalNumber
  completionsCount: Integer
  stars: Star[]
}

export class Planet extends Entity<PlanetProps> {
  static create(dto: PlanetDto): Planet {
    return new Planet(
      {
        name: Name.create(dto.name),
        icon: Image.create(dto.icon),
        image: Image.create(dto.image),
        position: OrdinalNumber.create(dto.position, 'Posição do planeta'),
        completionsCount: Integer.create(
          dto.completionsCount,
          'Quantidade de usuários que completaram esse planeta',
        ),
        stars: dto.stars.map(Star.create),
      },
      dto.id,
    )
  }

  getNextStar(currentStar: Star): Star | null {
    const nextStar = this.stars.find(
      (star) => star.number.value === currentStar?.number.increment().value,
    )
    return nextStar ?? null
  }

  get firstStar(): Star {
    const firstStar = this.stars[0]
    if (!firstStar) throw new EmptyPlanetError(this.name.value)
    return firstStar
  }

  get name(): Name {
    return this.props.name
  }

  get image(): Image {
    return this.props.image
  }

  get icon(): Image {
    return this.props.icon
  }

  get position(): OrdinalNumber {
    return this.props.position
  }

  get stars(): Star[] {
    return this.props.stars
  }

  get starsCount(): Integer {
    return Integer.create(this.stars.length)
  }

  get completionsCount(): Integer {
    return this.props.completionsCount
  }

  get dto(): PlanetDto {
    return {
      id: this.id.value,
      name: this.name.value,
      image: this.image.value,
      icon: this.icon.value,
      position: this.position.value,
      completionsCount: this.completionsCount.value,
      stars: this.stars.map((star) => star.dto),
    }
  }
}
