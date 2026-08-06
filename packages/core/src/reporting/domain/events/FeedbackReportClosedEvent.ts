import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  reportId: string
  messageId?: string
}

export class FeedbackReportClosedEvent extends Event<Payload> {
  static readonly _NAME = 'feedback.report.closed'

  constructor(payload: Payload) {
    super(FeedbackReportClosedEvent._NAME, payload)
  }
}
