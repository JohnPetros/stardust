import type { ChallengeDto } from '#dtos'
import { Entity } from '#domain/abstracts'
import { ChallengeDifficulty, Id, Name, Slug, Text } from '#domain/structs'

export type ChallengeProps = {
  code: string
  title: Name
  slug: Slug
  difficulty: ChallengeDifficulty
  docId: Id | null
  starId: Id | null
}

export class Challenge extends Entity<ChallengeProps> {
  static create(dto: ChallengeDto): Challenge {
    return new Challenge(
      {
        code: '',
        title: Name.create(dto.title),
        difficulty: ChallengeDifficulty.create(dto.difficulty),
        docId: dto.docId ? Id.create(dto.docId) : null,
        starId: dto.starId ? Id.create(dto.starId) : null,
        slug: Slug.create(dto.slug),
      },
      dto.id,
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

  get dto(): ChallengeDto {
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
