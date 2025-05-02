import { Integer, Logical, OrdinalNumber } from '#global/domain/structures/index'

type LevelProps = {
  value: OrdinalNumber
  didUp: Logical
}

export class Level {
  private static readonly BASE_INCREASE_XP = Integer.create(50)
  private static readonly MINIMUM_XP = Integer.create(25)
  readonly value: OrdinalNumber
  readonly didUp: Logical

  private constructor({ value, didUp }: LevelProps) {
    this.value = value
    this.didUp = didUp
  }

  static create(value?: number): Level {
    if (!value) {
      return new Level({
        value: OrdinalNumber.create(1),
        didUp: Logical.create(false),
      })
    }

    return new Level({
      value: OrdinalNumber.create(value),
      didUp: Logical.create(false),
    })
  }

  up(currentXp: Integer, newXp: Integer) {
    const xpSum = currentXp.plus(newXp)

    const baseXp = Level.BASE_INCREASE_XP.multiply(this.value.number.decrement()).plus(
      Level.MINIMUM_XP,
    )

    const hasNewLevel = xpSum.isGreaterOrEqualTo(baseXp)

    if (hasNewLevel.isTrue) {
      return new Level({
        didUp: this.didUp.becomeTrue(),
        value: this.value.increment(),
      })
    }

    return this
  }
}
