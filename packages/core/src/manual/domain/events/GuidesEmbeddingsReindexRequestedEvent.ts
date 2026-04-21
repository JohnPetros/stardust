import { Event } from '#global/domain/abstracts/Event'

export class GuidesEmbeddingsReindexRequestedEvent extends Event {
  static readonly _NAME = 'manual/guides.embeddings.reindex.requested'

  constructor() {
    super(GuidesEmbeddingsReindexRequestedEvent._NAME, {})
  }
}
