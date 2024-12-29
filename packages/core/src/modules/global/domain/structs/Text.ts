import { StringValidation } from '#libs'

export class Text {
  private constructor(readonly value: string) {}

  static create(value: string): Text {
    new StringValidation(value, 'Valor do texto').min(3).validate()

    return new Text(value)
  }

  countCharacters(characters: string): number {
    let count = 0

    for (let i = 0; i < this.value.length; i++) {
      if (characters === this.value.slice(i, characters.length + i)) count++
    }

    return count
  }
}
