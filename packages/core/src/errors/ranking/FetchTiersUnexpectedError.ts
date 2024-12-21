import { UnexpectedError } from '../global'

export class FetchTiersUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao buscar tiers.')
  }
}
