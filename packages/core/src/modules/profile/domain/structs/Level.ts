import { OrdinalNumber, Logical } from '#global/structs'

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

  static create(value?: number): Level {
    if (!value) {
      return new Level({
        number: OrdinalNumber.create(1),
        didUp: Logical.create(false),
      })
    }

    return new Level({
      number: OrdinalNumber.create(value),
      didUp: Logical.create(false),
    })
  }

  up(currentXp: number, newXp: number) {
    const xpSum = currentXp + newXp

    const hasNewLevel =
      xpSum >= Level.BASE_INCREASE_XP * (this.number.value - 1) + Level.MINIMUM_XP

    if (hasNewLevel) {
      return new Level({
        didUp: this.didUp.makeTrue(),
        number: this.number.incrementOne(),
      })
    }

    return this
  }

  get value() {
    return this.number.value
  }
}
