import { Entity } from '#global/domain/abstracts/index'
import {
  Name,
  Image,
  OrdinalNumber,
  Integer,
  Logical,
  Id,
  Text,
} from '#global/domain/structures/index'
import type { PlanetDto } from './dtos'
import { EmptyPlanetError, StarNotFoundError } from '../errors'
import { Star } from './Star'

type PlanetProps = {
  name: Name
  image: Image
  galaxyId: Id
  position: OrdinalNumber
  userCount: Integer
  completionCount: Integer
  isAvailable: Logical
  stars: Star[]
  concept: Text | null
}

export class Planet extends Entity<PlanetProps> {
  static create(dto: PlanetDto): Planet {
    const stars = dto.stars.map(Star.create)
    stars.sort((a, b) => a.number.value - b.number.value)
    return new Planet(
      {
        name: Name.create(dto.name),
        image: Image.create(dto.image),
        galaxyId: Id.create(dto.galaxyId),
        position: OrdinalNumber.create(dto.position, 'Posição do planeta'),
        ...Planet.createCounters(dto),
        stars,
        concept: dto.concept ? Text.create(dto.concept) : null,
      },
      dto.id,
    )
  }

  private static createCounters(
    dto: PlanetDto,
  ): Pick<PlanetProps, 'completionCount' | 'userCount' | 'isAvailable'> {
    return {
      completionCount: Integer.create(
        dto.completionCount,
        'Quantidade de usuários que completaram esse planeta',
      ),
      userCount: Integer.create(
        dto.userCount,
        'Quantidade de usuários que estão nesse planeta',
      ),
      isAvailable: Logical.create(
        dto.isAvailable,
        'O planeta está disponível para os usuários?',
      ),
    }
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
      userCount: 0,
      unlockCount: 0,
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

  set name(name: Name) {
    this.props.name = name
  }

  get image(): Image {
    return this.props.image
  }

  set image(image: Image) {
    this.props.image = image
  }

  get concept(): Text | null {
    return this.props.concept
  }

  get galaxyId(): Id {
    return this.props.galaxyId
  }

  get position(): OrdinalNumber {
    return this.props.position
  }

  set position(position: OrdinalNumber) {
    this.props.position = position
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

  get completionCount(): Integer {
    return this.props.completionCount
  }

  get userCount(): Integer {
    return this.props.userCount
  }

  get dto(): PlanetDto {
    return {
      id: this.id.value,
      name: this.name.value,
      image: this.image.value,
      galaxyId: this.galaxyId.value,
      position: this.position.value,
      completionCount: this.completionCount.value,
      userCount: this.userCount.value,
      isAvailable: this.isAvailable.value,
      stars: this.stars.map((star) => star.dto),
      concept: this.concept?.value ?? null,
    }
  }
}
