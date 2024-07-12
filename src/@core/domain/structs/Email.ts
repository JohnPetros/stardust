import { StringValidation } from '@/@core/lib/validation'
import { BaseStruct } from '../abstracts'

type EmailProps = {
  value: string
}

export class Email extends BaseStruct<EmailProps> {
  readonly value: string

  private constructor(value: string) {
    super({ value })
    this.value = value
  }

  static create(value: string) {
    new StringValidation(value).email().validate()

    return new Email(value)
  }
}
