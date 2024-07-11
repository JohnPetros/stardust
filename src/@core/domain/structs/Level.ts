import { LevelInvalidValueError } from '@/@core/errors/validation'
import { BaseStruct } from '../abstracts'

type LevelProps = {
  value: number
}

export class Level extends BaseStruct<LevelProps> {
  readonly value: number

  private constructor(value: number) {
    super({ value })
    this.value = value
  }

  static create(value: number) {
    if (value < 1) throw new LevelInvalidValueError(value)

    return new Level(value)
  }
}
