import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import type { FeedbackReportDto } from '../domain/entities/dtos'
import type { FeedbackReportsRepository } from '../interfaces/FeedbackReportsRepository'
import { FeedbackReport } from '../domain/entities'
import { FeedbackReportSentEvent } from '../domain/events'

type Request = FeedbackReportDto
type Response = Promise<FeedbackReportDto>

export class SendFeedbackReportUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: FeedbackReportsRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request): Response {
    console.log('Sending feedback report:', request)
    const report = FeedbackReport.create(request)
    await this.repository.add(report)
    const event = new FeedbackReportSentEvent({
      feedbackReportId: report.id.value,
      feedbackReportContent: report.content.value,
      feedbackReportIntent: report.intent.value,
      feedbackReportSentAt: report.sentAt.toISOString(),
      screenshot: report.screenshot?.value,
      author: report.author.dto,
    })
    await this.broker.publish(event)
    return report.dto
  }
}
