import type {
  FeedbackMessageAttachmentDto,
  FeedbackMessageDto,
  FeedbackReportDetailsDto,
  FeedbackReportDto,
} from '@stardust/core/reporting/entities/dtos'

export type FeedbackView = 'home' | 'create' | 'createSuccess' | 'history' | 'detail'
export type FeedbackFilter = 'all' | 'open' | 'closed'
export type FeedbackRequestState = 'idle' | 'loading' | 'error' | 'empty' | 'content'

export type FeedbackDraftAttachment = {
  id: string
  file: File
  previewUrl: string
}

export type FeedbackConversationDraft = {
  content: string
  attachments: FeedbackDraftAttachment[]
}

export type FeedbackDialogData = {
  reports: FeedbackReportDto[]
  detail: FeedbackReportDetailsDto | null
  unreadCount: number
  filter: FeedbackFilter
  listState: FeedbackRequestState
  detailState: FeedbackRequestState
  errorMessage?: string
}

export type FeedbackAttachment = FeedbackMessageAttachmentDto
export type FeedbackMessage = FeedbackMessageDto
