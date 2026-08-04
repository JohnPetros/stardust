import type { Email, Id } from '../../global/domain/structures'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'
import type { FeedbackReportsPageDto } from '../domain/entities/dtos'
import type { FeedbackReportsListingParams } from '../domain/types'
import type { FeedbackReportStatus } from '../domain/structures/FeedbackReportStatus'

export interface FeedbackReportsRepository {
  add(report: FeedbackReport): Promise<void>
  findById(feedbackReportId: Id): Promise<FeedbackReport | null>
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
  markAsRead(feedbackReportId: Id, lastSeenUserMessageAt: Date): Promise<void>
}
