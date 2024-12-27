import { Entity } from '#global/abstracts'
import { Id, Integer, Logical, Name, Slug, TextBlock } from '#global/structs'
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
  textBlocks: TextBlock[]
  description: string
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
        description: dto.description,
        textBlocks: dto.textBlocks.map((dto) => {
          let textBlock = TextBlock.create(dto.type, dto.content)
          if (dto.picture) textBlock = textBlock.setPicture(dto.picture)
          if (dto.title) textBlock = textBlock.setTitle(dto.title)
          if (dto.isRunnable) textBlock = textBlock.setIsRunnable(dto.isRunnable)
          return textBlock
        }),
        categories: [],
        createdAt: dto.createdAt,
      },
      dto?.id,
    )
  }

  removeUpvote() {
    this.upvotesCount = this.upvotesCount.dencrement(1)
  }

  removeDownvote() {
    this.downvotesCount = this.downvotesCount.dencrement(1)
  }

  upvote() {
    this.upvotesCount = this.upvotesCount.increment(1)
    this.removeDownvote()
  }

  downvote() {
    const hasUpvotes = this.upvotesCount.value > 0
    if (hasUpvotes) {
      this.removeUpvote()
      this.downvotesCount = this.downvotesCount.increment(1)
    }
  }

  set categories(categories: ChallengeCategory[]) {
    this.props.categories = categories
  }

  get isFromStar(): Logical {
    return Logical.create(
      'Esse desafio pertence a uma estrela?',
      Boolean(this.props.starId),
    )
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

  get description() {
    return this.props.description
  }

  get textBlocks() {
    return this.props.textBlocks
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

  set upvotesCount(upvotesCount: Integer) {
    this.props.upvotesCount = upvotesCount
  }

  get downvotesCount() {
    return this.props.downvotesCount
  }

  set downvotesCount(downvotesCount: Integer) {
    this.props.downvotesCount = downvotesCount
  }

  get completionsCount() {
    return this.props.completionsCount
  }

  get docId() {
    return this.props.docId
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
      description: this.description,
      createdAt: this.createdAt,
      textBlocks: [],
    }
  }
}
