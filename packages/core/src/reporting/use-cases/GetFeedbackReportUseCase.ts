import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { FeedbackReportNotFoundError } from '../domain/errors'
import type { FeedbackReportDetailsDto } from '../domain/entities/dtos'
import type { FeedbackMessagesRepository, FeedbackReportsRepository } from '../interfaces'

export type GetFeedbackReportRequest = { feedbackReportId: string }

export class GetFeedbackReportUseCase
  implements UseCase<GetFeedbackReportRequest, Promise<FeedbackReportDetailsDto>>
{
  constructor(
    private readonly reports: FeedbackReportsRepository,
    private readonly messages: FeedbackMessagesRepository,
  ) {}

  async execute({ feedbackReportId }: GetFeedbackReportRequest) {
    const id = Id.create(feedbackReportId)
    const report = await this.reports.findById(id)
    if (!report) throw new FeedbackReportNotFoundError()
    const messages = await this.messages.listByReport(id)
    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.authorRole.isUser)
    return {
      ...report.dto,
      messages: messages.map((message) => message.dto),
      latestUserMessageId: latestUserMessage?.id.value,
    }
  }
}
