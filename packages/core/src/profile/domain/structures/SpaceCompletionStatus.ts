import { ValidationError } from '#global/domain/errors/ValidationError'
import { Logical } from '#global/domain/structures/Logical'

type SpaceCompletionStatusValue = 'completed' | 'not-completed' | 'all'

export class SpaceCompletionStatus {
  private constructor(readonly value: SpaceCompletionStatusValue) {}

  static create(value: string) {
    if (!SpaceCompletionStatus.isValid(value)) {
      throw new ValidationError([
        {
          name: 'O espaço está completo pelo usuário?',
          messages: ['O espaço está completo pelo usuário deve ser sim ou não'],
        },
      ])
    }
    return new SpaceCompletionStatus(value)
  }

  static isValid(value: string): value is SpaceCompletionStatusValue {
    return value === 'completed' || value === 'not-completed' || value === 'all'
  }

  get isCompleted() {
    return Logical.create(this.value === 'completed')
  }

  get isNotCompleted() {
    return Logical.create(this.value === 'not-completed')
  }
}
