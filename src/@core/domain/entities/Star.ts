import { Entity } from '../abstracts'
import type { StarDTO } from '@/@core/dtos/StarDTO'
import { Id, OrdinalNumber, Logical, Slug, Name } from '../structs'

type StarsProps = {
  slug: Slug
  name: Name
  number: OrdinalNumber
  isChallenge: Logical
  planetId: Id
}

export class Star extends Entity<StarsProps> {
  static create(dto: StarDTO): Star {
    return new Star({
      slug: Slug.create(dto.slug),
      name: Name.create(dto.name),
      number: OrdinalNumber.create('star number', dto.number),
      isChallenge: Logical.create('is star a challenge?', dto.isChallenge),
      planetId: Id.create(dto.planetId),
    }, dto?.id)
  }

  get dto(): StarDTO {
    return {
      id: this.id,
      name: this.name.value,
      number: this.number.value,
      slug: this.slug.value,
      isChallenge: this.isChallenge.value,
      planetId: this.props.planetId.value,
    }
  }

  get name() {
    return this.props.name
  }

  get number() {
    return this.props.number
  }

  get slug() {
    return this.props.slug
  }

  get isChallenge() {
    return this.props.isChallenge
  }

  // get texts() {
  //   return this.props.texts
  // }
}
