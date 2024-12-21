import { UnexpectedError } from '../global'

export class SaveAcquiredAvatarUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao salvar o avatar adquirido.')
  }
}
