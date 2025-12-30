import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  guideId: string
  guideContent: string
}

export class GuideContentEditedEvent extends Event<Payload> {
  static readonly _NAME = 'manual/guide.content.edited'

  constructor(readonly payload: Payload) {
    super(GuideContentEditedEvent._NAME, payload)
  }
}
