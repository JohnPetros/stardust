import { BaseError } from '../global/BaseError'

export class QuestionsByStarNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Questions By Star Not Found Error'
    this.message = 'Perguntas não encontradas para a estrela em questão'
  }
}
