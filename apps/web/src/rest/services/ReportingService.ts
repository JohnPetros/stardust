import type { ReportingService as IReportingService } from '@stardust/core/reporting/interfaces'
import type { FeedbackReport } from '@stardust/core/reporting/entities'
import type { RestClient } from '@stardust/core/global/interfaces'

export const ReportingService = (restClient: RestClient): IReportingService => {
  return {
    async sendFeedbackReport(feedbackReport: FeedbackReport) {
      return await restClient.post('/reporting/feedback', feedbackReport.dto)
    },
  }
}
