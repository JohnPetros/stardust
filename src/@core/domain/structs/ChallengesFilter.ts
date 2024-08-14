import { ChallengeDifficulty } from './ChallengeDifficulty'
import { ChallengeCompletion } from './ChallengeCompletion'
import { List } from './List'
import type { ChallengeCategory } from '../entities'

type ChallengesFilterDTO = {
  difficultyLevel: string
  completionStatus: string
  categories: ChallengeCategory[]
}

type ChallengesFilterProps = {
  difficulty: ChallengeDifficulty
  completion: ChallengeCompletion
  categories: List<ChallengeCategory>
}

export class ChallengesFilter {
  difficulty: ChallengeDifficulty | null
  completion: ChallengeCompletion | null
  tags: List<string>

  private constructor({ categories, completion, difficulty }: ChallengesFilterProps) {
    this.categories = categories
    this.completion = completion
    this.difficulty = difficulty
  }

  static create(dto: ChallengesFilterDTO) {
    return new ChallengesFilter({
      completion: ChallengeCompletion.create(dto.completionStatus),
      difficulty: ChallengeDifficulty.create(dto.difficultyLevel),
      categories: List.create(dto.categories),
    })
  }
}
