import { StringValidation } from '@/@core/lib/validation'
import { BaseStruct } from '@/@core/domain/abstracts/BaseStruct'

type NameProps = {
  value: string
}

export class Name extends BaseStruct<NameProps> {
  readonly value: string

  private constructor(value: string) {
    super({ value })
    this.value = value
  }

  static create(value: string) {
    new StringValidation(value, 'Name').min(2).validate()

    return new Name(value)
  }

  removeAccentuation() {
    const newValue = this.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    return Name.create(newValue)
  }
}
