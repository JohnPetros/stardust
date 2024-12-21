import { UnexpectedError } from '../global'

export class FetchDocsUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao buscar dados do dicionário')
  }
}
