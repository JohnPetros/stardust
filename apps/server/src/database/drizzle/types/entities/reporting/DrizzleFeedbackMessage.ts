import type { feedbackMessageModel } from '../../../models/reporting/feedback-message-model'
import type { feedbackMessageAttachmentModel } from '../../../models/reporting/feedback-message-attachment-model'

export type DrizzleFeedbackMessage = typeof feedbackMessageModel.$inferSelect & {
  feedbackMessageAttachments?: (typeof feedbackMessageAttachmentModel.$inferSelect)[]
}
export type DrizzleInsertFeedbackMessage = typeof feedbackMessageModel.$inferInsert
