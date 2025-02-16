import { StringValidation } from '../../../../libs'

export class Email {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string) {
    new StringValidation(value).email().validate()

    return new Email(value)
  }
}
