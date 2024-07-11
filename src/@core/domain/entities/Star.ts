import { BaseEntity } from '../abstracts'
import type { StarDTO } from '@/@core/dtos/StarDTO'
import { Name } from '../structs/Name'
import { Slug } from '../structs/Slug'
import { Text } from './Text'

type StarsProps = {
  id: string
  slug: Slug
  name: Name
  number: number
  // texts: Text[]
  // questions: Question[]
  isChallenge: boolean
  planetId: string
}

export class Star extends BaseEntity {
  private props: StarsProps

  private constructor(props: StarsProps) {
    super()
    this.props = props
  }

  static create(dto: StarDTO) {
    return new Star({
      id: dto.id,
      slug: Slug.create(dto.slug),
      name: Name.create(dto.name),
      number: dto.number,
      isChallenge: dto.isChallenge,
      planetId: dto.planetId,
      // texts: dto.texts.map(Text.create),
    })
  }

  get dto(): StarDTO {
    return {
      id: this.id,
      name: this.name.value,
      number: this.number,
      slug: this.slug.value,
      isChallenge: this.isChallenge,
      planetId: this.planetId,
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
