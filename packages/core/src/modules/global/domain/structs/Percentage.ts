import { NumberValidation } from '#libs'

export class Percentage {
  readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(part: number, total: number, key = 'Porcentagem') {
    new NumberValidation(part, key).min(1).validate()
    new NumberValidation(total, key).min(0).validate()

    return new Percentage(total ? (part / total) * 100 : 0)
  }
}
