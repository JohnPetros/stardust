import type { ChallengeDTO } from '@/@core/dtos'
import { Entity } from '../abstracts'
import { ChallengeDifficulty, Name, Slug } from '../structs'

export type ChallengeProps = {
  id?: string
  code: string
  title: Name
  slug: Slug
  difficulty: ChallengeDifficulty
}

export class Challenge extends Entity<ChallengeProps> {
  static create(dto: ChallengeDTO): Challenge {
    return new Challenge({
      title: Name.create(dto.title),
      slug: Slug.create(dto.slug),
      code: dto.code,
      difficulty: ChallengeDifficulty.create(dto.difficulty),
    }, dto?.id)
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
    }
  }
}
