import { NotFoundError } from '../../../global/domain/errors'

export class TextsBlocksByStarNotFoundError extends NotFoundError {
  constructor() {
    super('Blocos de texto não encontrados para a estrela em questão.')
  }
}
