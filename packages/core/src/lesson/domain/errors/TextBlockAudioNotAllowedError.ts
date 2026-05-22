import { NotAllowedError } from '../../../global/domain/errors'

export class TextBlockAudioNotAllowedError extends NotAllowedError {
  constructor(type: string) {
    super(`O bloco de texto do tipo ${type} nao permite geracao de audio.`)
  }
}
