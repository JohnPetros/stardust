import type { Email, Id } from '../../global/domain/structures'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'
import type { FeedbackReportsPageDto } from '../domain/entities/dtos'
import type { FeedbackReportsListingParams } from '../domain/types'
import type { FeedbackReportStatus } from '../domain/structures/FeedbackReportStatus'

export interface FeedbackReportsRepository {
  add(report: FeedbackReport): Promise<void>
  findById(feedbackReportId: Id): Promise<FeedbackReport | null>
  findByIdAndAuthor(feedbackReportId: Id, authorId: Id): Promise<FeedbackReport | null>
  findAuthorEmail(feedbackReportId: Id): Promise<Email | null>
  list(params: FeedbackReportsListingParams): Promise<FeedbackReportsPageDto>
  findMany(params: FeedbackReportsListingParams): Promise<{
    items: FeedbackReport[]
    count: number
  }>
  save(report: FeedbackReport): Promise<void>
  changeStatus(
    report: FeedbackReport,
    expectedStatus: FeedbackReportStatus,
  ): Promise<FeedbackReport>
  listByAuthor(input: {
    authorId: Id
    status?: FeedbackReportStatus
    page: import('../../global/domain/structures/OrdinalNumber').OrdinalNumber
    itemsPerPage: import('../../global/domain/structures/OrdinalNumber').OrdinalNumber
  }): Promise<{ items: FeedbackReport[]; total: number }>
  countUnreadByAuthor(authorId: Id): Promise<number>
  markAsRead(input: {
    feedbackReportId: Id
    participant: 'author' | 'studio'
    lastSeenMessageAt: Date
    authorId?: Id
  }): Promise<void>
}
