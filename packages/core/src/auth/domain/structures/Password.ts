import { StringValidation } from '#global/libs/index'

export class Password {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    new StringValidation(value).min(6).validate()

    return new Password(value)
  }
}
