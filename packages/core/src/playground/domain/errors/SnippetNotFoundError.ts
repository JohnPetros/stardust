import { NotAllowedError } from '../../../global/domain/errors'

export class SnippetNotFoundError extends NotAllowedError {
  constructor() {
    super('Snippet não encontrado')
  }
}
