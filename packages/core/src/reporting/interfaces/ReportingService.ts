import type { RestResponse } from '#global/responses/index'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'
import type {
  ChangeFeedbackReportStatusRequest,
  CreateFeedbackAttachmentUploadRequest,
  FeedbackReportsListingParams,
  SendFeedbackMessageRequest,
} from '../domain/types'
import type {
  FeedbackReportDto,
  FeedbackReportDetailsDto,
  FeedbackReportsPageDto,
} from '../domain/entities/dtos'
import type { Id } from '#global/domain/structures/Id'
import type { SignedUploadUrlDto } from '#storage/domain/structures/dtos/SignedUploadUrlDto'
import type { SendFeedbackMessageResponseDto } from '../domain/entities/dtos'

export interface ReportingService {
  sendFeedbackReport(feedbackReport: FeedbackReport): Promise<RestResponse<void>>
  listFeedbackReports(
    params: FeedbackReportsListingParams,
  ): Promise<RestResponse<FeedbackReportsPageDto>>
  getFeedbackReport(feedbackReportId: Id): Promise<RestResponse<FeedbackReportDetailsDto>>
  markFeedbackReportAsRead(
    feedbackReportId: Id,
    lastSeenUserMessageId: Id,
  ): Promise<RestResponse<void>>
  createFeedbackAttachmentUploadUrl(
    feedbackReportId: Id,
    messageId: Id,
    request: CreateFeedbackAttachmentUploadRequest,
  ): Promise<RestResponse<SignedUploadUrlDto>>
  sendFeedbackMessage(
    feedbackReportId: Id,
    request: SendFeedbackMessageRequest,
  ): Promise<RestResponse<SendFeedbackMessageResponseDto>>
  changeFeedbackReportStatus(
    feedbackReportId: Id,
    request: ChangeFeedbackReportStatusRequest,
  ): Promise<RestResponse<FeedbackReportDto>>
}
