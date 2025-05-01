import { StringValidation } from '../../libs'
import { Logical } from './Logical'
import { Slug } from './Slug'
import type { Text } from './Text'

export class Name {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string, key = 'Name') {
    new StringValidation(value, key).min(2).validate()

    return new Name(value)
  }

  removeAccentuation() {
    const newValue = this.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    return Name.create(newValue)
  }

  isLike(text: Text): Logical {
    if (text.value === '') {
      return Logical.createAsFalse()
    }
    const currentValue = this.removeAccentuation().value.trim().toLowerCase()
    return Logical.create(currentValue.includes(text.value.trim().toLowerCase()))
  }

  get slug() {
    const nameWithoutAccentuation = this.removeAccentuation()
    return Slug.create(nameWithoutAccentuation.value).value
  }
}
