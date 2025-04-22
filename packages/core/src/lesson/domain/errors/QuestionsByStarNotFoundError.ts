import { NotFoundError } from '../../../global/domain/errors'

export class QuestionsByStarNotFoundError extends NotFoundError {
  constructor() {
    super('Perguntas não encontradas para a estrela em questão.')
  }
}
