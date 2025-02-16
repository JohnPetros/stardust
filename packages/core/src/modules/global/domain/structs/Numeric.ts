import { NumberValidation } from '#libs'

export class Numeric {
  readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(value: number) {
    new NumberValidation(value, 'Numeric value').validate()

    return new Numeric(value)
  }

  static isNumeric(value: unknown): value is number {
    return /^-?\d+(\.\d+)?$/.test(String(value))
  }
}
