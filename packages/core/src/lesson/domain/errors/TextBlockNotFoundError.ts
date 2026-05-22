import { NotFoundError } from '../../../global/domain/errors'

export class TextBlockNotFoundError extends NotFoundError {
  constructor() {
    super('Bloco de texto nao encontrado para a estrela em questao.')
  }
}
