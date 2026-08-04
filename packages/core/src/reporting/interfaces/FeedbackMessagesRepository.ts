import type { Id } from '#global/domain/structures/Id'
import type { FeedbackMessage } from '../domain/entities/FeedbackMessage'

export interface FeedbackMessagesRepository {
  add(message: FeedbackMessage): Promise<FeedbackMessage>
  addAttachments(message: FeedbackMessage): Promise<void>
  findById(messageId: Id): Promise<FeedbackMessage | null>
  listByReport(feedbackReportId: Id): Promise<FeedbackMessage[]>
}
