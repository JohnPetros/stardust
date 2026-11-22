import { ValidationError } from '#global/domain/errors/ValidationError'
import { Logical } from '#global/domain/structures/Logical'

export type StarProgressStateValue = 'locked' | 'available' | 'completed'

export class StarProgressState {
  private constructor(readonly value: StarProgressStateValue) {}

  static create(value: string): StarProgressState {
    if (!StarProgressState.isStarProgressStateValue(value)) {
      throw new ValidationError([
        { name: 'star progress state', messages: ['Não é um estado de estrela válido'] },
      ])
    }

    return new StarProgressState(value)
  }

  static isStarProgressStateValue(value: string): value is StarProgressStateValue {
    return ['locked', 'available', 'completed'].includes(value)
  }

  get isLocked(): Logical {
    return Logical.create(this.value === 'locked')
  }

  get isAvailable(): Logical {
    return Logical.create(this.value === 'available')
  }

  get isCompleted(): Logical {
    return Logical.create(this.value === 'completed')
  }

  get isAccessible(): Logical {
    return this.isAvailable.or(this.isCompleted)
  }
}
