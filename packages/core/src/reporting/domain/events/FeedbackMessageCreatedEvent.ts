import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  reportId: string
  messageId: string
  recipientEmail?: string
  reply: string
  preview: string
  conversationUrl: string
  isClosed: boolean
  idempotencyKey: string
}

export class FeedbackMessageCreatedEvent extends Event<Payload> {
  static readonly _NAME = 'feedback.message.created'

  constructor(payload: Payload) {
    super(FeedbackMessageCreatedEvent._NAME, payload)
  }
}
