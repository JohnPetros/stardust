import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  reportId: string
  messageId: string
}

export class FeedbackAdminMessageSentEvent extends Event<Payload> {
  static readonly _NAME = 'feedback.admin.message.sent'

  constructor(payload: Payload) {
    super(FeedbackAdminMessageSentEvent._NAME, payload)
  }
}
