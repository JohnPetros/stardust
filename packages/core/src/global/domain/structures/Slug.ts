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
      .replace(/[^a-z0-9\s-]/g, '') // remove qualquer caractere que não seja letra, número, espaço ou hífen
      .replace(/\s+/g, '-') // troca espaços por hífens
      .replace(/-+/g, '-') // evita múltiplos hífens seguidos
      .replace(/^-+|-+$/g, '') // remove hífens do início e do final

    return new Slug(slugValue)
  }

  static deslugify(value: string) {
    const deslugified = value
      .trim()
      .replace(/-+/g, ' ') // substitui hífens por espaço
      .replace(/\s+/g, ' ') // normaliza múltiplos espaços
      .toLowerCase()

    return deslugified
  }
}
