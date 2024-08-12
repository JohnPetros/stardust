import { BaseError } from '../global/BaseError'

export class TextsBlocksByStarNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Texts blocks By Star Not Found Error'
    this.message = 'Blocos de texto não encontrados para a estrela em questão'
  }
}
