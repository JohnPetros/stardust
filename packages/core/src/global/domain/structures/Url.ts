import { StringValidation } from '#global/libs/index'

export class Url {
  constructor(readonly value: string) {}

  static create(value: string): Url {
    new StringValidation(value, 'Url').url('deve ser uma url válida').validate()
    return new Url(value)
  }
}
