import { Logical } from './Logical'
import { OrdinalNumber } from './OrdinalNumber'

type LevelProps = {
  number: OrdinalNumber
  didUp: Logical
}

export class Level {
  private static readonly BASE_INCREASE_XP = 50
  private static readonly MINIMUM_XP = 25
  readonly number: OrdinalNumber
  readonly didUp: Logical

  private constructor({ number, didUp }: LevelProps) {
    this.number = number
    this.didUp = didUp
  }

  static create(value: number): Level {
    return new Level({
      number: OrdinalNumber.create('Level', value),
      didUp: Logical.create('Did level up?', false),
    })
  }

  up(newXp: number) {
    const hasNewLevel =
      newXp >= Level.BASE_INCREASE_XP * (this.number.value - 1) + Level.MINIMUM_XP

    if (hasNewLevel) {
      return new Level({
        didUp: this.didUp.makeTrue(),
        number: this.number.incrementOne(),
      })
    }
  }
}
