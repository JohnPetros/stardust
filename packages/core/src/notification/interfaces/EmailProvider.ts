import type { SendFeedbackReportReplyEmailRequest } from '#reporting/domain/types/FeedbackConversationRequests'

export interface EmailProvider {
  sendFeedbackReportReplyEmail(
    request: SendFeedbackReportReplyEmailRequest,
  ): Promise<void>
}
