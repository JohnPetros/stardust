import type { ChallengeDTO } from '@/@core/dtos'
import { BaseEntity } from '../abstracts'
import { ChallengeDifficulty, Id, Logical, Name, Slug } from '../structs'

export type ChallengeProps = {
  code: string
  title: Name
  slug: Slug
  difficulty: ChallengeDifficulty
  docId: Id | null
  starId: Id | null
}

export class Challenge extends BaseEntity {
  private props: ChallengeProps

  private constructor(props: ChallengeProps, id?: string) {
    super(id)
    this.props = props
  }

  static create(dto: ChallengeDTO): Challenge {
    return new Challenge(
      {
        title: Name.create(dto.title),
        slug: Slug.create(dto.slug),
        code: dto.code,
        difficulty: ChallengeDifficulty.create(dto.difficulty),
        docId: dto.docId ? Id.create(dto.docId) : null,
        starId: dto.starId ? Id.create(dto.starId) : null,
      },
      dto?.id,
    )
  }

  get isFromStar(): Logical {
    return Logical.create('Is challenge from a star?', this.props.starId !== null)
  }

  get hasDoc(): Logical {
    return Logical.create('Challenge has doc?', this.props.docId !== null)
  }

  get docId(): Id {
    if (!this.props.docId) throw Error()
    return this.props.docId
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

  get difficulty() {
    return this.props.difficulty
  }

  get dto(): ChallengeDTO {
    return {
      id: this.id,
      title: this.title.value,
      code: this.code,
      slug: this.slug.value,
      difficulty: this.difficulty.level,
      docId: this.props.docId?.value,
    }
  }
}
