import { StringValidation } from '../../libs'
import { Integer } from './Integer'

export class Text {
  private constructor(readonly value: string) {}

  static create(value: string, key?: string): Text {
    new StringValidation(value, key).validate()

    return new Text(value)
  }

  countCharacters(characters: string): Integer {
    let count = 0

    for (let index = 0; index < this.value.length; index++) {
      if (characters === this.value.slice(index, characters.length + index)) count++
    }

    return Integer.create(count)
  }
}
