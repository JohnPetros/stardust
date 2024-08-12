import { BaseError } from '../global/BaseError'

export class ValidationError extends BaseError {
  constructor(messages: string[]) {
    super()
    this.title = 'Validation Error'
    this.message = messages.join(', ')
  }
}
