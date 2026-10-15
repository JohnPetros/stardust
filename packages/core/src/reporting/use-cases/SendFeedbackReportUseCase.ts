import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import type { FeedbackReportDto } from '../domain/entities/dtos'
import type { FeedbackReportsRepository } from '../interfaces/FeedbackReportsRepository'
import { FeedbackReport } from '../domain/entities'
import { FeedbackReportSentEvent } from '../domain/events'
import type { SendFeedbackReportRequest } from '../domain/types'

type Request = SendFeedbackReportRequest | FeedbackReportDto
type Response = Promise<FeedbackReportDto>

export class SendFeedbackReportUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly database: Database,
    private readonly repository: FeedbackReportsRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request): Response {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction(request: Request): Response {
    const report = this.createReport(request)
    await this.repository.add(report)
    await this.broker.publish(this.sentEvent(report))
    return report.dto
  }
  private createReport(request: Request) {
    const attachment =
      'initialAttachment' in request ? request.initialAttachment : undefined
    const screenshot = attachment?.storageKey ?? this.screenshot(request)
    return FeedbackReport.create({ ...request, screenshot })
  }

  private screenshot(request: Request) {
    return 'screenshot' in request ? request.screenshot : undefined
  }

  private sentEvent(report: FeedbackReport) {
    return new FeedbackReportSentEvent({
      feedbackReportId: report.id.value,
      feedbackReportContent: report.content.value,
      ...this.reportMetadata(report),
    })
  }
  private reportMetadata(report: FeedbackReport) {
    return {
      feedbackReportIntent: report.intent.value,
      feedbackReportSentAt: report.sentAt.toISOString(),
      screenshot: report.screenshot?.value,
      author: report.author.dto,
    }
  }
}
