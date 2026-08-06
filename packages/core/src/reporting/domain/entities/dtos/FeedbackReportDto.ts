import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/AuthorAggregateDto'

export type FeedbackReportDto = {
  id?: string
  content: string
  screenshot?: string
  intent: string
  author: AuthorAggregateDto
  sentAt?: string
  title?: string
  status?: 'open' | 'closed'
  createdAt?: string
  lastActivityAt?: string
  lastUserMessageAt?: string
  studioReadAt?: string
  adminMessageCount?: number
  authorEmail?: string
  preview?: string
  isUnread?: boolean
}
