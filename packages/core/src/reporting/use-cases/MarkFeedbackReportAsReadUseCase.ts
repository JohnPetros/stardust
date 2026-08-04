import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { FeedbackReportNotFoundError } from '../domain/errors'
import type { FeedbackMessagesRepository, FeedbackReportsRepository } from '../interfaces'

export type MarkFeedbackReportAsReadRequest = {
  feedbackReportId: string
  lastSeenUserMessageId: string
}

export class MarkFeedbackReportAsReadUseCase
  implements UseCase<MarkFeedbackReportAsReadRequest, Promise<void>>
{
  constructor(
    private readonly reports: FeedbackReportsRepository,
    private readonly messages: FeedbackMessagesRepository,
  ) {}

  async execute(request: MarkFeedbackReportAsReadRequest): Promise<void> {
    const report = await this.reports.findById(Id.create(request.feedbackReportId))
    if (!report) throw new FeedbackReportNotFoundError()
    const message = await this.messages.findById(Id.create(request.lastSeenUserMessageId))
    if (
      !message ||
      message.reportId.value !== report.id.value ||
      !message.authorRole.isUser
    ) {
      throw new FeedbackReportNotFoundError()
    }
    await this.reports.markAsRead(report.id, message.createdAt)
  }
}
