import { BaseError } from '../global/BaseError'

type CountInvalidValueErrorProps = {
  key: string
  value: number
}

export class CountInvalidValueError extends BaseError {
  constructor({ key, value }: CountInvalidValueErrorProps) {
    super()
    this.title = 'Count Invalid Value Error'
    this.message = `Valor da contagem ${key}: ${value}, deveria ser maior ou igual a 0`
  }
}
