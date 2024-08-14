import type { ChallengeDTO } from '@/@core/dtos'
import { Entity } from '../abstracts'
import { ChallengeDifficulty, Id, Integer, Name, Slug } from '../structs'
import type { ChallengeCategory } from './ChallengeCategory'

export type ChallengeProps = {
  id?: string
  code: string
  title: Name
  slug: Slug
  difficulty: ChallengeDifficulty
  categories: ChallengeCategory[]
  authorSlug: Slug
  downvotesCount: Integer
  upvotesCount: Integer
  completionsCount: Integer
  createdAt: Date
  docId: Id | null
}

export class Challenge extends Entity<ChallengeProps> {
  static create(dto: ChallengeDTO): Challenge {
    return new Challenge(
      {
        title: Name.create(dto.title),
        slug: Slug.create(dto.slug),
        authorSlug: Slug.create(dto.authorSlug),
        code: dto.code,
        difficulty: ChallengeDifficulty.create(dto.difficulty),
        docId: dto.docId ? Id.create(dto.docId) : null,
        completionsCount: Integer.create(
          'Challenge completions count',
          dto.completionsCount,
        ),
        downvotesCount: Integer.create('Challenge downvotes count', dto.downvotesCount),
        upvotesCount: Integer.create('Challenge upvotes count', dto.upvotesCount),
        createdAt: dto.createdAt,
        categories: [],
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

  get authorSlug() {
    return this.props.authorSlug
  }

  get upvotesCount() {
    return this.props.upvotesCount
  }

  get downvotesCount() {
    return this.props.downvotesCount
  }

  get completionsCount() {
    return this.props.completionsCount
  }

  get createdAt() {
    return this.props.createdAt
  }

  get dto(): ChallengeDTO {
    return {
      id: this.id,
      title: this.title.value,
      code: this.code,
      slug: this.slug.value,
      difficulty: this.difficulty.level,
      docId: this.props.docId?.value,
      authorSlug: this.authorSlug.value,
      downvotesCount: this.downvotesCount.value,
      upvotesCount: this.upvotesCount.value,
      completionsCount: this.completionsCount.value,
      createdAt: this.createdAt,
    }
  }
}
