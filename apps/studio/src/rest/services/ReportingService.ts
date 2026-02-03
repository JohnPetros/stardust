import type { ReportingService as IReportingService } from '@stardust/core/reporting/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { FeedbackReportsListingParams } from '@stardust/core/reporting/types'
import type { FeedbackReportDto } from '@stardust/core/reporting/entities/dtos'
import type { Id } from '@stardust/core/global/structures'
import type { PaginationResponse } from '@stardust/core/global/responses'
import type { FeedbackReport } from '@stardust/core/reporting/entities'
import { Datetime } from '@stardust/core/global/libs'

export const ReportingService = (restClient: RestClient): IReportingService => {
  return {
    async sendFeedbackReport(feedbackReport: FeedbackReport) {
      return await restClient.post('/reporting/feedback', feedbackReport.dto)
    },
    async listFeedbackReports(params: FeedbackReportsListingParams) {
      restClient.clearQueryParams()
      if (params.page) {
        restClient.setQueryParam('page', params.page.value.toString())
      }
      if (params.itemsPerPage) {
        restClient.setQueryParam('itemsPerPage', params.itemsPerPage.value.toString())
      }
      if (params.authorName) {
        restClient.setQueryParam('authorName', params.authorName.value)
      }
      if (params.intent) {
        restClient.setQueryParam('intent', params.intent.value)
      }
      if (params.sentAtPeriod?.startDate) {
        restClient.setQueryParam(
          'startDate',
          new Datetime(params.sentAtPeriod.startDate).format('YYYY-MM-DD'),
        )
      }
      if (params.sentAtPeriod?.endDate) {
        restClient.setQueryParam(
          'endDate',
          new Datetime(params.sentAtPeriod.endDate).format('YYYY-MM-DD'),
        )
      }

      return await restClient.get<PaginationResponse<FeedbackReportDto>>(
        '/reporting/feedback',
      )
    },
    async deleteFeedbackReport(feedbackId: Id) {
      return await restClient.delete(`/reporting/feedback/${feedbackId.value}`)
    },
  }
}
