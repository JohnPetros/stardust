import type { RestResponse } from '#global/responses/index'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'

export interface ReportingService {
  sendFeedbackReport(feedbackReport: FeedbackReport): Promise<RestResponse<void>>
}
