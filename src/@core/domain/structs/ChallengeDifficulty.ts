import { StringValidation } from '@/@core/lib/validation'
import type { ChallengeDifficultyLevel } from '../types'

export class ChallengeDifficulty {
  private constructor(readonly level: ChallengeDifficultyLevel) {}

  static create(level: string) {
    if (!ChallengeDifficulty.isDifficultyLevel(level)) throw new Error()

    return new ChallengeDifficulty(level)
  }

  static isDifficultyLevel(level: string): level is ChallengeDifficultyLevel {
    new StringValidation(level, 'Challenge Difficulty Level').oneOf([
      'easy',
      'medium',
      'hard',
    ])

    return true
  }
}
