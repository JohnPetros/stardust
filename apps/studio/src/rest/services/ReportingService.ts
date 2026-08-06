import type { ReportingService as IReportingService } from '@stardust/core/reporting/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type {
  ChangeFeedbackReportStatusRequest,
  CreateFeedbackAttachmentUploadRequest,
  FeedbackReportsListingParams,
  SendFeedbackMessageRequest,
} from '@stardust/core/reporting/types'
import type {
  FeedbackReportDetailsDto,
  FeedbackReportDto,
  FeedbackReportsPageDto,
} from '@stardust/core/reporting/entities/dtos'
import type { Id } from '@stardust/core/global/structures'
import type { SignedUploadUrlDto } from '@stardust/core/storage/structures/dtos'
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
      if (params.search) restClient.setQueryParam('search', params.search.value)
      if (params.authorName)
        restClient.setQueryParam('authorName', params.authorName.value)
      if (params.intent) {
        restClient.setQueryParam('intent', params.intent.value)
      }
      if (params.status) restClient.setQueryParam('status', params.status.value)
      if (params.createdAtPeriod?.startDate) {
        restClient.setQueryParam(
          'createdAtStartDate',
          new Datetime(params.createdAtPeriod.startDate).format('YYYY-MM-DD'),
        )
      }
      if (params.createdAtPeriod?.endDate) {
        restClient.setQueryParam(
          'createdAtEndDate',
          new Datetime(params.createdAtPeriod.endDate).format('YYYY-MM-DD'),
        )
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

      return await restClient.get<FeedbackReportsPageDto>('/reporting/feedback')
    },
    async getFeedbackReport(feedbackReportId: Id) {
      return await restClient.get<FeedbackReportDetailsDto>(
        `/reporting/feedback/${feedbackReportId.value}`,
      )
    },
    async markFeedbackReportAsRead(feedbackReportId: Id, lastSeenUserMessageId: Id) {
      return await restClient.put<void>(
        `/reporting/feedback/${feedbackReportId.value}/read`,
        {
          lastSeenUserMessageId: lastSeenUserMessageId.value,
        },
      )
    },
    async createFeedbackAttachmentUploadUrl(
      feedbackReportId: Id,
      messageId: Id,
      request: CreateFeedbackAttachmentUploadRequest,
    ) {
      return await restClient.post<SignedUploadUrlDto>(
        `/reporting/feedback/${feedbackReportId.value}/messages/${messageId.value}/attachments/signed-upload-url`,
        {
          fileName: request.fileName.value,
          mimeType: request.mimeType.value,
          size: request.size.value,
        },
      )
    },
    async sendFeedbackMessage(feedbackReportId: Id, request: SendFeedbackMessageRequest) {
      return await restClient.post(
        `/reporting/feedback/${feedbackReportId.value}/messages`,
        {
          messageId: request.messageId.value,
          content: request.content.value,
          attachments: request.attachments,
          targetStatus: request.targetStatus?.value,
        },
      )
    },
    async changeFeedbackReportStatus(
      feedbackReportId: Id,
      request: ChangeFeedbackReportStatusRequest,
    ) {
      return await restClient.patch<FeedbackReportDto>(
        `/reporting/feedback/${feedbackReportId.value}/status`,
        {
          status: request.status.value,
          expectedStatus: request.expectedStatus.value,
        },
      )
    },
  }
}
