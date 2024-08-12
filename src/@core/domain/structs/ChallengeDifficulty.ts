import { StringValidation } from '@/@core/lib/validation'
import { ValidationError } from '@/@core/errors/lib'
import type { ChallengeDifficultyLevel } from '../types'

export class ChallengeDifficulty {
  private constructor(readonly level: ChallengeDifficultyLevel) {}

  static create(level: string) {
    if (!ChallengeDifficulty.isDifficultyLevel(level)) {
      throw new ValidationError(['Challenge Difficulty Level is not valid'])
    }

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
