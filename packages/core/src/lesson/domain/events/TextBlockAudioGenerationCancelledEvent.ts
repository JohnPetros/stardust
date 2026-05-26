import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  starId: string
  blockIndex: number
}

export class TextBlockAudioGenerationCancelledEvent extends Event<Payload> {
  static readonly _NAME = 'lesson/text-block.audio.generation.cancelled'

  constructor(readonly payload: Payload) {
    super(TextBlockAudioGenerationCancelledEvent._NAME, payload)
  }
}
