import type { Email } from '#global/domain/structures/Email'
import type { Id } from '#global/domain/structures/Id'
import type { Integer } from '#global/domain/structures/Integer'
import type { Logical } from '#global/domain/structures/Logical'
import type { Text } from '#global/domain/structures/Text'
import type { SignedUploadUrlDto } from '#storage/domain/structures/dtos/SignedUploadUrlDto'
import type { FeedbackMessage } from '../entities/FeedbackMessage'
import type { FeedbackReport } from '../entities/FeedbackReport'
import type { FeedbackMessageAttachmentDto } from '../entities/dtos/FeedbackMessageDto'
import type { FeedbackReportStatus } from '../structures/FeedbackReportStatus'

export type ListFeedbackReportsRequest = FeedbackReportsListingRequest
export type GetFeedbackReportRequest = { feedbackReportId: string }
export type MarkFeedbackReportAsReadRequest = {
  feedbackReportId: string
  lastSeenUserMessageId: string
}

export type FeedbackReportsListingRequest = {
  search?: string
  intent?: string
  status?: string
  createdAtStartDate?: string
  createdAtEndDate?: string
  page?: number
  itemsPerPage?: number
}

export type FeedbackMessageAttachmentRequest = FeedbackMessageAttachmentDto

export type CreateFeedbackAttachmentUploadRequest = {
  fileName: Text
  mimeType: Text
  size: Integer
}
export type CreateFeedbackAttachmentUploadUseCaseRequest =
  CreateFeedbackAttachmentUploadRequest & {
    feedbackReportId: string
    messageId: string
    actor: { accountId: string; role: 'user' | 'admin' }
  }

export type SendFeedbackMessageRequest = {
  messageId: Id
  content: Text
  attachments: FeedbackMessageAttachmentRequest[]
  targetStatus?: FeedbackReportStatus
}

export type SendFeedbackMessageUseCaseRequest = {
  feedbackReportId: string
  actor: { accountId: string; role: 'user' | 'admin' }
  messageId: string
  content: string
  attachments: FeedbackMessageAttachmentRequest[]
  targetStatus?: string
}

export type SendFeedbackMessageResponse = {
  report: FeedbackReport
  message: FeedbackMessage
  isDuplicate: Logical
}

export type ChangeFeedbackReportStatusRequest = {
  status: FeedbackReportStatus
  expectedStatus: FeedbackReportStatus
}
export type ChangeFeedbackReportStatusUseCaseRequest = {
  feedbackReportId: string
  status: string
  expectedStatus: string
}

export type SendFeedbackReportReplyEmailRequest = {
  recipientEmail: Email
  subject: Text
  html: Text
  text: Text
  idempotencyKey: Text
}

export type FeedbackReplyEmailRequest = SendFeedbackReportReplyEmailRequest

export type CreateFeedbackAttachmentUploadResponse = SignedUploadUrlDto
