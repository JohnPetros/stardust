import { NotFoundError } from '../../../global/domain/errors'

export class TextBlockNotFoundError extends NotFoundError {
  constructor() {
    super('Bloco de texto não encontrado para a estrela em questão.')
  }
}
