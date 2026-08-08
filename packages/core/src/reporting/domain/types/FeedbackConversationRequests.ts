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
import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/AuthorAggregateDto'
import type { FeedbackIntent } from '../structures/FeedbackIntent'

export type ListFeedbackReportsRequest = FeedbackReportsListingRequest
export type GetUserFeedbackReportRequest = {
  feedbackReportId: string
  authorId: string
}
export type ListUserFeedbackReportsRequest = {
  authorId: string
  status?: 'open' | 'closed'
  page?: number
  itemsPerPage?: number
}
export type CountUnreadFeedbackReportsRequest = { authorId: string }
export type MarkUserFeedbackReportAsReadRequest = {
  feedbackReportId: string
  actor: { accountId: string; role: 'user' | 'admin' }
  lastSeenMessageId: string
}

/** @deprecated Use GetUserFeedbackReportRequest for the author-facing flow. */
export type GetFeedbackReportRequest = { feedbackReportId: string }

export type LegacyMarkFeedbackReportAsReadRequest = {
  feedbackReportId: string
  lastSeenUserMessageId: string
}

export type MarkFeedbackReportAsReadRequest =
  | MarkUserFeedbackReportAsReadRequest
  | LegacyMarkFeedbackReportAsReadRequest

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

export type FeedbackInitialAttachmentRequest = {
  storageKey: string
  originalName: string
  mimeType: 'image/png' | 'image/jpeg'
  size: number
}

export type CreateFeedbackReportRequest = {
  content: Text
  intent: FeedbackIntent
  initialAttachment?: FeedbackInitialAttachmentRequest
}

export type SendFeedbackReportRequest = {
  content: string
  intent: 'bug' | 'idea' | 'other'
  author: AuthorAggregateDto
  initialAttachment?: FeedbackInitialAttachmentRequest
}

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

export type CreateFeedbackReportAttachmentUploadRequest = {
  actorId: string
  fileName: Text
  mimeType: Text
  size: Integer
}
