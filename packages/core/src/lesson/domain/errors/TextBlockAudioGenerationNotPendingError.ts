import { NotAllowedError } from '../../../global/domain/errors'

export class TextBlockAudioGenerationNotPendingError extends NotAllowedError {
  constructor(status: string) {
    super(`A geração de áudio não pode continuar quando o status atual é ${status}.`)
  }
}
