import { Event } from '#global/domain/abstracts/Event'
import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/index'

type Payload = {
  feedbackReportId: string
  feedbackReportContent: string
  feedbackReportIntent: string
  feedbackReportSentAt: string
  screenshot?: string
  author: AuthorAggregateDto
}

export class FeedbackReportSentEvent extends Event<Payload> {
  static readonly _NAME = 'reporting/feedback-report.sent'

  constructor(readonly payload: Payload) {
    super(FeedbackReportSentEvent._NAME, payload)
  }
}
