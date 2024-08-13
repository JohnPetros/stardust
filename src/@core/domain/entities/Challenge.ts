import type { ChallengeDTO } from '@/@core/dtos'
import { Entity } from '../abstracts'
import { ChallengeDifficulty, Id, Name, Slug } from '../structs'
import type { ChallengeCategory } from './ChallengeCategory'

export type ChallengeProps = {
  id?: string
  code: string
  title: Name
  slug: Slug
  difficulty: ChallengeDifficulty
  categories: ChallengeCategory[]
  docId: Id | null
}

export class Challenge extends Entity<ChallengeProps> {
  static create(dto: ChallengeDTO): Challenge {
    return new Challenge(
      {
        title: Name.create(dto.title),
        slug: Slug.create(dto.slug),
        code: dto.code,
        difficulty: ChallengeDifficulty.create(dto.difficulty),
        categories: [],
        docId: dto.docId ? Id.create(dto.docId) : null,
      },
      dto?.id,
    )
  }

  set categories(categories: ChallengeCategory[]) {
    this.props.categories = categories
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

  get categories() {
    return this.props.categories
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
