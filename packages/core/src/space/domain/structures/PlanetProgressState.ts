import { ValidationError } from '#global/domain/errors/ValidationError'
import { Logical } from '#global/domain/structures/Logical'

export type PlanetProgressStateValue = 'locked' | 'liberated' | 'opened'

export class PlanetProgressState {
  private constructor(readonly value: PlanetProgressStateValue) {}

  static create(value: string): PlanetProgressState {
    if (!PlanetProgressState.isPlanetProgressStateValue(value)) {
      throw new ValidationError([
        {
          name: 'planet progress state',
          messages: ['Não é um estado de planeta válido'],
        },
      ])
    }

    return new PlanetProgressState(value)
  }

  static isPlanetProgressStateValue(value: string): value is PlanetProgressStateValue {
    return ['locked', 'liberated', 'opened'].includes(value)
  }

  get isLocked(): Logical {
    return Logical.create(this.value === 'locked')
  }

  get isLiberated(): Logical {
    return Logical.create(this.value === 'liberated')
  }

  get isOpened(): Logical {
    return Logical.create(this.value === 'opened')
  }
}
