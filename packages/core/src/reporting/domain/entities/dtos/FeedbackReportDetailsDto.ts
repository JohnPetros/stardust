import type { FeedbackReportDto } from './FeedbackReportDto'
import type { FeedbackMessageDto } from './FeedbackMessageDto'

export type FeedbackReportDetailsDto = FeedbackReportDto & {
  messages: FeedbackMessageDto[]
  latestUserMessageId?: string
  latestAdminMessageId?: string
}
