import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/AuthorAggregateDto'

export type FeedbackReportDto = {
  id?: string
  content: string
  screenshot?: string
  intent: string
  author: AuthorAggregateDto
  sentAt?: string
}
