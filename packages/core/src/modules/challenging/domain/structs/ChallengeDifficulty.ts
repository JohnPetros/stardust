import { StringValidation } from '#libs'
import { ValidationError } from '#global/errors'
import type { ChallengeDifficultyLevel } from '#challenging/types'

export class ChallengeDifficulty {
  private constructor(readonly level: ChallengeDifficultyLevel) {}

  static create(level: string) {
    if (!ChallengeDifficulty.isDifficultyLevel(level)) {
      throw new ValidationError([
        {
          name: 'challengen-difficulty',
          messages: ['Challenge Difficulty Level is not valid'],
        },
      ])
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
