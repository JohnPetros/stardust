import type { ChallengeDTO } from '@/@core/dtos'
import { BaseEntity } from '../abstracts'
import { Name, Slug } from '../structs'

export type ChallengeProps = {
  id?: string
  code: string
  title: Name
  slug: Slug
}

export class Challenge extends BaseEntity {
  private props: ChallengeProps

  private constructor(props: ChallengeProps) {
    super(props.id)
    this.props = props
  }

  static create(dto: ChallengeDTO): Challenge {
    return new Challenge({
      id: dto.id,
      code: dto.code,
      title: Name.create(dto.title),
      slug: Slug.create(dto.slug),
    })
  }

  get dto(): ChallengeDTO {
    return {
      id: this.id,
      title: this.title.value,
      code: this.code,
      slug: this.slug.value,
    }
  }

  get title() {
    return this.props.title
  }

  get code() {
    return this.props.code
  }

  get slug() {
    return this.props.slug
  }
}
