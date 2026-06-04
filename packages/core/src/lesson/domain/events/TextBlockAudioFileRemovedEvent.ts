import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  fileName: string
}

export class TextBlockAudioFileRemovedEvent extends Event<Payload> {
  static readonly _NAME = 'lesson/text-block.audio-file.removed'

  constructor(readonly payload: Payload) {
    super(TextBlockAudioFileRemovedEvent._NAME, payload)
  }
}
