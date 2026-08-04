import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  reportId: string
  messageId: string
  userName?: string
  preview: string
  hasAttachments: boolean
  conversationUrl: string
}

export class FeedbackUserMessageCreatedEvent extends Event<Payload> {
  static readonly _NAME = 'feedback.user.message.created'

  constructor(payload: Payload) {
    super(FeedbackUserMessageCreatedEvent._NAME, payload)
  }
}
