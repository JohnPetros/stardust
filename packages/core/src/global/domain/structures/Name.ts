import { StringValidation } from '../../libs'
import { Logical } from './Logical'
import { Slug } from './Slug'
import type { Text } from './Text'

export class Name {
  readonly value: string
  private readonly DUPLICATION_REGEX = /\((\d+)\)/

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

  deduplicate() {
    if (this.isDuplicated.isTrue) {
      const newValue = this.value.replace(this.DUPLICATION_REGEX, (_, numero) => {
        return `(${parseInt(numero) + 1})`
      })
      return Name.create(newValue)
    }

    return Name.create(this.value.concat('(1)'))
  }

  get isDuplicated() {
    return Logical.create(this.DUPLICATION_REGEX.test(this.value))
  }

  get slug() {
    const nameWithoutAccentuation = this.removeAccentuation()
    return Slug.create(nameWithoutAccentuation.value)
  }
}
