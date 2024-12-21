import { NotFoundError } from '../global'

export class QuestionsByStarNotFoundError extends NotFoundError {
  constructor() {
    super('Perguntas não encontradas para a estrela em questão.')
  }
}
