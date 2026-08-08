import type { RestResponse } from '#global/responses/index'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'
import type {
  ChangeFeedbackReportStatusRequest,
  CreateFeedbackReportRequest,
  CreateFeedbackAttachmentUploadRequest,
  FeedbackReportsListingParams,
  SendFeedbackMessageRequest,
} from '../domain/types'
import type {
  FeedbackReportDto,
  FeedbackReportDetailsDto,
  FeedbackReportsPageDto,
  UserFeedbackReportsPageDto,
} from '../domain/entities/dtos'
import type { Id } from '#global/domain/structures/Id'
import type { SignedUploadUrlDto } from '#storage/domain/structures/dtos/SignedUploadUrlDto'
import type { SendFeedbackMessageResponseDto } from '../domain/entities/dtos'
import type { FeedbackReportStatusValue } from '../domain/structures/FeedbackReportStatus'

export interface ReportingService {
  sendFeedbackReport(
    request: CreateFeedbackReportRequest,
  ): Promise<RestResponse<FeedbackReportDto>>
  sendFeedbackReport(feedbackReport: FeedbackReport): Promise<RestResponse<void>>
  listFeedbackReports(
    params: FeedbackReportsListingParams,
  ): Promise<RestResponse<FeedbackReportsPageDto>>
  getFeedbackReport(feedbackReportId: Id): Promise<RestResponse<FeedbackReportDetailsDto>>
  markFeedbackReportAsRead(
    feedbackReportId: Id,
    lastSeenUserMessageId: Id,
  ): Promise<RestResponse<void>>
  listMyFeedbackReports(params: {
    status?: FeedbackReportStatusValue
    page: import('#global/domain/structures/OrdinalNumber').OrdinalNumber
    itemsPerPage: import('#global/domain/structures/OrdinalNumber').OrdinalNumber
  }): Promise<RestResponse<UserFeedbackReportsPageDto>>
  countMyUnreadFeedbackReports(): Promise<RestResponse<{ count: number }>>
  getMyFeedbackReport(
    feedbackReportId: Id,
  ): Promise<RestResponse<FeedbackReportDetailsDto>>
  markMyFeedbackReportAsRead(
    feedbackReportId: Id,
    lastSeenAdminMessageId: Id,
  ): Promise<RestResponse<void>>
  createFeedbackReportAttachmentUploadUrl(
    request: CreateFeedbackAttachmentUploadRequest,
  ): Promise<RestResponse<SignedUploadUrlDto>>
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
