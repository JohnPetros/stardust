import { Name } from './Name'

export class Slug {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  static create(value: string) {
    return Slug.slugify(value)
  }

  private static slugify(value: string) {
    const name = Name.create(value).removeAccentuation()

    const slugValue = name.value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    return new Slug(slugValue)
  }

  static deslugify(value: string) {
    const words = value.split('-')

    const name = words
      .map((word) => {
        const firstLetter = word[0].toUpperCase()
        return firstLetter + word.slice(1)
      })
      .join(' ')

    return name
  }

  get value() {
    return this._value
  }
}
