import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  guideId: string
}

export class GuideDeletedEvent extends Event<Payload> {
  static readonly _NAME = 'manual/guide.deleted'

  constructor(readonly payload: Payload) {
    super(GuideDeletedEvent._NAME, payload)
  }
}
