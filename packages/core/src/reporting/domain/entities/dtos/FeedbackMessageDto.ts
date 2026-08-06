export type FeedbackMessageAttachmentDto = {
  id: string
  storageKey: string
  originalName: string
  mimeType: string
  size: number
}

export type FeedbackMessageDto = {
  id?: string
  reportId: string
  authorRole: 'user' | 'admin'
  authorId: string
  content: string
  createdAt?: string
  attachments: FeedbackMessageAttachmentDto[]
}

export type SendFeedbackMessageResponseDto = {
  report: import('./FeedbackReportDto').FeedbackReportDto
  message: FeedbackMessageDto
  isDuplicate: boolean
}
