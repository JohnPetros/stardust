import type { ChallengeDTO } from '@/@core/dtos'
import { Entity } from '../abstracts'
import {
  ChallengeDifficulty,
  Id,
  Integer,
  Logical,
  Name,
  Slug,
  Text,
  TextBlock,
} from '../structs'
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
  descriptionTextBlocks: TextBlock[]
  description: Text
  createdAt: Date
  starId: Id | null
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
        starId: dto.starId ? Id.create(dto.starId) : null,
        completionsCount: Integer.create(
          'Challenge completions count',
          dto.completionsCount,
        ),
        downvotesCount: Integer.create('Challenge downvotes count', dto.downvotesCount),
        upvotesCount: Integer.create('Challenge upvotes count', dto.upvotesCount),
        createdAt: dto.createdAt,
        descriptionTextBlocks: dto.descriptionTextBlocks.map((textBlock) =>
          TextBlock.create(textBlock.type, textBlock.content),
        ),
        description: Text.create(dto.description),
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

  get description() {
    return this.props.description
  }

  get descriptionTextBlocks() {
    return this.props.descriptionTextBlocks
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
      description: this.props.description.value,
      descriptionTextBlocks: this.descriptionTextBlocks.map((textBlock) => textBlock.dto),
      createdAt: this.createdAt,
    }
  }
}
