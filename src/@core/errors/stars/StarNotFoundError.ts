import { BaseError } from '../global/BaseError'

export class StarNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Star Not Found Error'
    this.message = 'Estrela não encontrada'
  }
}
