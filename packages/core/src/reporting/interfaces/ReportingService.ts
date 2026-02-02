import type { PaginationResponse, RestResponse } from '#global/responses/index'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'
import type { FeedbackReportsListingParams } from '../domain/types'
import type { FeedbackReportDto, Id } from '../../main'

export interface ReportingService {
  sendFeedbackReport(feedbackReport: FeedbackReport): Promise<RestResponse<void>>
  listFeedbackReports(
    params: FeedbackReportsListingParams,
  ): Promise<RestResponse<PaginationResponse<FeedbackReportDto>>>
  deleteFeedbackReport(feedbackId: Id): Promise<RestResponse>
}
