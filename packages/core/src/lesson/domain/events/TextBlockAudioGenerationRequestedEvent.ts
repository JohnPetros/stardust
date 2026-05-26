import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  starId: string
  blockIndex: number
  content: string
  voice: string
  currentAudioFileName: string | null
}

export class TextBlockAudioGenerationRequestedEvent extends Event<Payload> {
  static readonly _NAME = 'lesson/text-block.audio.generation.requested'

  constructor(readonly payload: Payload) {
    super(TextBlockAudioGenerationRequestedEvent._NAME, payload)
  }
}
