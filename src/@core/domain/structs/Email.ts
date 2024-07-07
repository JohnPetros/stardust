import { Validation } from '@/@core/libs/validation'

export class Email {
  readonly value: string

  private constructor(value: string) {
    this.value = value

    const response = Validation.validateEmail(this)
    if (!response.isValid) response.throwError()
  }

  static create(value: string) {
    return new Email(value)
  }
}
