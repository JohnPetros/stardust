import type { RestResponse } from '@stardust/core/global/responses'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'

export interface ReportingService {
  sendFeedbackReport(feedbackReport: FeedbackReport): Promise<RestResponse>
}
