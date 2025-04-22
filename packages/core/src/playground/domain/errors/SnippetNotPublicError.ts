import { NotAllowedError } from '../../../global/domain/errors'

export class SnippetNotPublicError extends NotAllowedError {
  constructor() {
    super('Esse snippet não é pública para outros usuário')
  }
}
