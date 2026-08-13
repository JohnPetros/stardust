import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { FeedbackReportNotFoundError } from '../domain/errors'
import type { FeedbackReportDetailsDto } from '../domain/entities/dtos'
import type { GetUserFeedbackReportRequest } from '../domain/types'
import type { FeedbackMessagesRepository, FeedbackReportsRepository } from '../interfaces'

export class GetUserFeedbackReportUseCase
  implements UseCase<GetUserFeedbackReportRequest, Promise<FeedbackReportDetailsDto>>
{
  constructor(
    private readonly reports: FeedbackReportsRepository,
    private readonly messages: FeedbackMessagesRepository,
  ) {}

  async execute(
    request: GetUserFeedbackReportRequest,
  ): Promise<FeedbackReportDetailsDto> {
    const reportId = Id.create(request.feedbackReportId)
    const report = await this.reports.findByIdAndAuthor(
      reportId,
      Id.create(request.authorId),
    )
    if (!report) throw new FeedbackReportNotFoundError()

    const conversation = await this.messages.listByReport(reportId)
    const latestUserMessage = [...conversation]
      .reverse()
      .find((message) => message.authorRole.isUser.value)
    const latestAdminMessage = [...conversation]
      .reverse()
      .find((message) => message.authorRole.isAdmin.value)

    return {
      ...report.dto,
      messages: conversation.map((message) => message.dto),
      latestUserMessageId: latestUserMessage?.id.value,
      latestAdminMessageId: latestAdminMessage?.id.value,
    }
  }
}
