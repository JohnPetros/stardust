import { NotAllowedError } from '../../../global/domain/errors'

export class TextBlockAudioRemovalNotAllowedError extends NotAllowedError {
  constructor(status: string) {
    super(
      `A remocao manual de audio nao pode continuar quando o status atual e ${status}.`,
    )
  }
}
