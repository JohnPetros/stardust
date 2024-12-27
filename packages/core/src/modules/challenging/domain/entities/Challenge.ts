import { Entity } from '#global/abstracts'
import { Id, Integer, Logical, Name, Slug, Text, TextBlock } from '#global/structs'
import { ChallengeDifficulty } from '#challenging/structs'
import type { ChallengeDto } from '#challenging/dtos'
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
  starId: Id | null
  docId: Id | null
}

export class Challenge extends Entity<ChallengeProps> {
  static create(dto: ChallengeDto): Challenge {
    return new Challenge(
      {
        title: Name.create(dto.title),
        slug: Slug.create(dto.slug),
        authorSlug: Slug.create(dto.authorSlug),
        code: dto.code,
        difficulty: ChallengeDifficulty.create(dto.difficulty),
        docId: dto.docId ? Id.create(dto.docId) : null,
        starId: dto.starId ? Id.create(dto.starId) : null,
        completionsCount: Integer.create(
          'Quantidade de vezes que esse desafio foi completado',
          dto.completionsCount,
        ),
        downvotesCount: Integer.create('Contagem de dowvotes', dto.downvotesCount),
        upvotesCount: Integer.create('Contagem de upvotes', dto.upvotesCount),
        createdAt: dto.createdAt,
        categories: [],
      },
      dto?.id,
    )
  }

  set categories(categories: ChallengeCategory[]) {
    this.props.categories = categories
  }

  get isFromStar(): Logical {
    return Logical.create('Is challenge from a star?', Boolean(this.props.starId))
  }

  get canShowComments(): Logical {
    return Logical.create('Can show challenge comments?', Boolean(this.props.starId))
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

  get dto(): ChallengeDto {
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
