import { UnexpectedError } from '../global'

export class SaveRankingLosersUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao salvar os perdedores de cada ranking.')
  }
}
