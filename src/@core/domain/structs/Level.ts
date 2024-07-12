import { NumberValidation } from '@/@core/lib/validation'
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
    new NumberValidation(value, 'Nível').min(1).validate()

    return new Level(value)
  }
}
