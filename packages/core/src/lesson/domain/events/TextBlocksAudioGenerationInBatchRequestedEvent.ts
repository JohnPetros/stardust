import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  starId: string
  blocks: Array<{
    blockIndex: number
    content: string
    voice: string
  }>
}

export class TextBlocksAudioGenerationInBatchRequestedEvent extends Event<Payload> {
  static readonly _NAME = 'lesson/text-blocks.audio-generation-in-batch.requested'

  constructor(readonly payload: Payload) {
    super(TextBlocksAudioGenerationInBatchRequestedEvent._NAME, payload)
  }
}
