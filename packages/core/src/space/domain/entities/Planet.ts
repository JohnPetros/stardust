import { Entity } from '#global/domain/abstracts/index'
import {
  Name,
  Image,
  OrdinalNumber,
  Integer,
  Logical,
  Id,
} from '#global/domain/structures/index'
import type { PlanetDto } from './dtos'
import { EmptyPlanetError, StarNotFoundError } from '../errors'
import { Star } from './Star'

type PlanetProps = {
  name: Name
  icon: Image
  image: Image
  position: OrdinalNumber
  completionsCount: Integer
  isAvailable: Logical
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
        isAvailable: Logical.create(
          dto.isAvailable,
          'O planeta está disponível para os usuários?',
        ),
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

  addStar(): void {
    const starName = this.getNewStarName()
    const star = Star.create({
      name: starName.value,
      slug: starName.slug.value,
      number: this.stars.length + 1,
      isAvailable: false,
      isChallenge: false,
    })
    this.props.stars.push(star)
  }

  removeStar(starId: Id): void {
    const star = this.stars.find((star) => star.id.value === starId.value)
    if (!star) throw new StarNotFoundError()

    const stars = []

    let starNumber = OrdinalNumber.create(1)

    for (let number = 1; number <= this.stars.length; number++) {
      const currentStar = this.stars[number - 1]
      if (currentStar.id.value === starId.value) continue

      currentStar.number = starNumber
      starNumber = starNumber.increment()
      stars.push(currentStar)
    }

    this.props.stars = stars
  }

  reorderStars(starIds: Id[]): void {
    const stars = []
    for (let number = 1; number <= starIds.length; number++) {
      const starId = starIds[number - 1]
      const star = this.findStarById(starId)
      star.number = OrdinalNumber.create(number)
      stars.push(star)
    }
    this.props.stars = stars
  }

  private findStarById(starId: Id): Star {
    const star = this.stars.find((star) => star.id.value === starId.value)
    if (!star) throw new StarNotFoundError()
    return star
  }

  private getNewStarName(): Name {
    let newStarName = Name.create('Nova estrela')

    while (this.stars.some((star) => star.name.isEqualTo(newStarName).isTrue)) {
      newStarName = newStarName.deduplicate()
    }

    return newStarName
  }

  get firstStar(): Star {
    const firstStar = this.stars[0]
    if (!firstStar) throw new EmptyPlanetError(this.name.value)
    return firstStar
  }

  get lastStar(): Star {
    const lastStar = this.stars[this.stars.length - 1]
    if (!lastStar) throw new EmptyPlanetError(this.name.value)
    return lastStar
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

  get isAvailable(): Logical {
    return this.props.isAvailable
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
      isAvailable: this.isAvailable.value,
      stars: this.stars.map((star) => star.dto),
    }
  }
}
