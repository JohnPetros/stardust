import { NotAllowedError } from '../../../global/domain/errors'

export class TextBlockAudioGenerationNotPendingError extends NotAllowedError {
  constructor(status: string) {
    super(`A geracao de audio nao pode continuar quando o status atual e ${status}.`)
  }
}
