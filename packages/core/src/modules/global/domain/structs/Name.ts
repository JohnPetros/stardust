import { StringValidation } from '#libs'
import { Slug } from './Slug'

export class Name {
  readonly value: string

  private constructor(value: string) {
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

  isLike(value: string) {
    const currentValue = this.removeAccentuation().value.trim().toLowerCase()

    return currentValue.includes(value.trim().toLowerCase())
  }

  get slug() {
    const nameWithoutAccentuation = this.removeAccentuation()
    return Slug.create(nameWithoutAccentuation.value).value
  }
}
