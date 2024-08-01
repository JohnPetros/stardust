import { BaseEntity } from '../abstracts'
import type { StarDTO } from '@/@core/dtos/StarDTO'
import { Id, OrdinalNumber, Logical, Slug, Name } from '../structs'

type StarsProps = {
  id?: string
  slug: Slug
  name: Name
  number: OrdinalNumber
  isChallenge: Logical
  planetId: Id
}

export class Star extends BaseEntity {
  private props: StarsProps

  private constructor(props: StarsProps) {
    super(props.id)
    this.props = props
  }

  static create(dto: StarDTO): Star {
    return new Star({
      id: dto?.id,
      slug: Slug.create(dto.slug),
      name: Name.create(dto.name),
      number: OrdinalNumber.create('star number', dto.number),
      isChallenge: Logical.create('is star a challenge?', dto.isChallenge),
      planetId: Id.create(dto.planetId),
    })
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
