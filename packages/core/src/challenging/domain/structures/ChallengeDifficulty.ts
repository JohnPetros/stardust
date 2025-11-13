import { ValidationError } from '#global/domain/errors/ValidationError'
import { StringValidation } from '#global/libs/validation/index'
import { Logical } from '#global/domain/structures/Logical'
import type { ChallengeDifficultyLevel } from '../types'

export class ChallengeDifficulty {
  static readonly REWARD_BY_DIFFICULTY = {
    easy: {
      coins: 10,
      xp: 20,
    },
    medium: {
      coins: 20,
      xp: 30,
    },
    hard: {
      coins: 30,
      xp: 40,
    },
    any: {
      coins: 0,
      xp: 0,
    },
    all: {
      coins: 0,
      xp: 0,
    },
  }

  private constructor(readonly level: ChallengeDifficultyLevel) {}

  static create(level: string) {
    if (!ChallengeDifficulty.isDifficultyLevel(level)) {
      throw new ValidationError([
        {
          name: 'challengen-difficulty',
          messages: ['Nível de dificuldade de desafio deve ser fácil, médio ou difícil'],
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
      'any',
      'all',
    ])

    return true
  }

  get reward() {
    return ChallengeDifficulty.REWARD_BY_DIFFICULTY[this.level]
  }

  get isHard(): Logical {
    return Logical.create(this.level === 'hard')
  }

  get isMedium(): Logical {
    return Logical.create(this.level === 'medium')
  }

  get isEasy(): Logical {
    return Logical.create(this.level === 'easy')
  }

  get isAny(): Logical {
    return Logical.create(this.level === 'any')
  }
}
