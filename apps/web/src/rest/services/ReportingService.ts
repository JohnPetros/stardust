import type { ReportingService as IReportingService } from '@stardust/core/reporting/interfaces'
import type { FeedbackReport } from '@stardust/core/reporting/entities'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Id } from '@stardust/core/global/structures'

export const ReportingService = (restClient: RestClient): IReportingService => {
  return {
    async sendFeedbackReport(feedbackReport: FeedbackReport) {
      return await restClient.post('/reporting/feedback', feedbackReport.dto)
    },
    async listFeedbackReports() {
      return await restClient.get('/reporting/feedback')
    },
    async deleteFeedbackReport(id: Id) {
      return await restClient.delete(`/reporting/feedback/${id.value}`)
    },
  }
}
