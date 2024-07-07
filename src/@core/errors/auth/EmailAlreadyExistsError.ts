import { BaseError } from '../global/BaseError'

export class EmailAlreadyExistsError extends BaseError {
  constructor() {
    super()
    this.title = 'Email Aldeady Exists Error'
    this.message = 'Email já cadastrado.'
  }
}
