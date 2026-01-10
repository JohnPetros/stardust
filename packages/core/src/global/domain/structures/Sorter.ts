import { ValidationError } from '../errors'
import { Logical } from './Logical'

type SorterValue = 'ascending' | 'descending' | 'none'

export class Sorter {
  private constructor(readonly value: SorterValue) {}

  static create(value?: string, name?: string) {
    if (!value) return new Sorter('none')

    if (!Sorter.isValid(value)) {
      throw new ValidationError([
        {
          name: name ? `Ordenador ${name}` : 'Ordenador',
          messages: ['Nível de dificuldade de desafio deve ser fácil, médio ou difícil'],
        },
      ])
    }
    return new Sorter(value)
  }

  static isValid(value: string): value is SorterValue {
    return ['ascending', 'descending', 'none'].includes(value)
  }

  get isAscending() {
    return Logical.create(this.value === 'ascending')
  }

  get isDescending() {
    return Logical.create(this.value === 'descending')
  }
}
