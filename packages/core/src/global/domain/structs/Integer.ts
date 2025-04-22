import { NumberValidation } from '../../libs'

export class Integer {
  readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(value: number, key = 'Número inteiro') {
    new NumberValidation(value, key).min(0).validate()

    return new Integer(value)
  }

  increment(value: number) {
    return new Integer(this.value + value)
  }

  dencrement(value: number) {
    return new Integer(this.value - value)
  }
}
