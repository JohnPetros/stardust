import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  starId: string
  blockIndex: number
  voice: string
  fileName: string
}

export class TextBlockAudioGeneratedEvent extends Event<Payload> {
  static readonly _NAME = 'lesson/text-block.audio.generated'

  constructor(readonly payload: Payload) {
    super(TextBlockAudioGeneratedEvent._NAME, payload)
  }
}
