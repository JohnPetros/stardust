import { UnexpectedError } from '../global'

export class SaveAcquiredRocketUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao salvar o foguete adquirido.')
  }
}
