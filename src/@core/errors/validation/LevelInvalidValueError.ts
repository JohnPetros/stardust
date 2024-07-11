import { BaseError } from '../global/BaseError'

export class LevelInvalidValueError extends BaseError {
  constructor(value: number) {
    super()
    this.title = 'Level Invalid Value Error'
    this.message = `Valor de nível: ${value}, deveria ser maior ou igual a 1`
  }
}
