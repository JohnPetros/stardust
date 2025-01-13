import { Entity } from '#global/abstracts'
import { Name } from '#global/structs'
import type { ChallengeCategoryDto } from '#challenging/dtos'

type ChallengeCategoryProps = {
  name: Name
}

export class ChallengeCategory extends Entity<ChallengeCategoryProps> {
  static create(dto: ChallengeCategoryDto): ChallengeCategory {
    return new ChallengeCategory(
      {
        name: Name.create(dto.name, 'Nome da categoria'),
      },
      dto?.id,
    )
  }

  get name() {
    return this.props.name
  }

  get dto(): ChallengeCategoryDto {
    return {
      id: this.id,
      name: this.name.value,
    }
  }
}
