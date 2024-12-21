import { UnexpectedError } from '../global'

export class SaveUnlockedStarUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao salvar estrela desbloqueada.')
  }
}
