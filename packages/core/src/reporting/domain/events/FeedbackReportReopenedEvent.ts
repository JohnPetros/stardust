import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  reportId: string
}

export class FeedbackReportReopenedEvent extends Event<Payload> {
  static readonly _NAME = 'feedback.report.reopened'

  constructor(payload: Payload) {
    super(FeedbackReportReopenedEvent._NAME, payload)
  }
}
