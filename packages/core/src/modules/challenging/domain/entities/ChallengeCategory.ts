import type { ChallengeCategoryDto } from '#challenging/dtos'
import { Entity } from '#global/abstracts'
import { List, Name } from '#global/structs'

export type ChallengeCategoryProps = {
  name: Name
  challengesIds: List<string>
}

export class ChallengeCategory extends Entity<ChallengeCategoryProps> {
  static create(dto: ChallengeCategoryDto): ChallengeCategory {
    return new ChallengeCategory(
      {
        name: Name.create(dto.name),
        challengesIds: List.create(dto.challengesIds),
      },
      dto?.id,
    )
  }

  includesChallenge(challengeId: string) {
    return this.challengesIds.includes(challengeId)
  }

  get name() {
    return this.props.name
  }

  get challengesIds() {
    return this.props.challengesIds
  }

  get dto(): ChallengeCategoryDto {
    return {
      id: this.id,
      name: this.name.value,
      challengesIds: this.challengesIds.items,
    }
  }
}
