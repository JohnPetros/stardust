import { StringValidation } from '../../libs'
import { Name } from './Name'

export class Slug {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string, key = 'Slug') {
    new StringValidation(value, key).min(2).validate()

    return Slug.slugify(value)
  }

  private static slugify(value: string) {
    const name = Name.create(value).removeAccentuation()

    const slugValue = name.value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replaceAll('?', '')
      .replaceAll('!', '')
      .replaceAll('.', '')
      .replaceAll('.', '')
      .replaceAll(',', '')
      .replaceAll(';', '')

    return new Slug(slugValue)
  }

  static deslugify(value: string) {
    const words = value.split('-')
    const name = words.join(' ')
    return name
  }
}
