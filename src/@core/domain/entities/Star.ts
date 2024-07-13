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
      slug: Slug.create(dto.slug),
      name: Name.create(dto.name),
      number: OrdinalNumber.create('star number', dto.number),
      isChallenge: Logical.create('is star a challenge?', dto.isChallenge),
      planetId: Id.create(dto.planetId),
      id: dto?.id,
      // texts: dto.texts.map(Text.create),
    })
  }

  get dto(): StarDTO {
    return {
      id: this.id,
      name: this.name.value,
      number: this.number.value,
      slug: this.slug.value,
      planetId: this.planetId.value,
      isChallenge: this.isChallenge.value,
      // texts: this.texts.map((text) => text.dto),
    }
  }

  get name() {
    return this.props.name
  }

  get planetId() {
    return this.props.planetId
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
