import { NotFoundError } from '../global'

export class TextsBlocksByStarNotFoundError extends NotFoundError {
  constructor() {
    super('Blocos de texto não encontrados para a estrela em questão.')
  }
}
