import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import { ConflictError } from '#global/domain/errors/ConflictError'
import { Id } from '#global/domain/structures/Id'
import { FeedbackReportNotFoundError } from '../domain/errors'
import { FeedbackReportStatus } from '../domain/structures/FeedbackReportStatus'
import type { FeedbackReportsRepository } from '../interfaces'
import type { ChangeFeedbackReportStatusUseCaseRequest } from '../domain/types'
import type { FeedbackReport } from '../domain/entities'
import { Text } from '#global/domain/structures/Text'
import { FeedbackReportClosedEvent, FeedbackReportReopenedEvent } from '../domain/events'

type Request = ChangeFeedbackReportStatusUseCaseRequest

export class ChangeFeedbackReportStatusUseCase
  implements
    UseCase<
      ChangeFeedbackReportStatusUseCaseRequest,
      Promise<import('../domain/entities/dtos').FeedbackReportDto>
    >
{
  constructor(
    private readonly database: Database,
    private readonly reports: FeedbackReportsRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction(request: Request) {
    const report = await this.findReport(request)
    const { expected, status } = this.prepareStatuses(report, request)
    const result = await this.persistStatus(report, expected, status)
    await this.publishStatus(report, result, status)
    return result.dto
  }

  private async findReport(request: Request) {
    const report = await this.reports.findById(Id.create(request.feedbackReportId))
    if (!report) throw new FeedbackReportNotFoundError()
    return report
  }

  private prepareStatuses(report: FeedbackReport, request: Request) {
    const expected = this.expectedStatus(report, request)
    const status = FeedbackReportStatus.create(request.status)
    return { expected, status }
  }

  private expectedStatus(report: FeedbackReport, request: Request) {
    const expected = FeedbackReportStatus.create(request.expectedStatus)
    if (report.status.value !== expected.value) {
      throw new ConflictError(`Estado canônico: ${report.status.value}`)
    }
    return expected
  }

  private transition(report: FeedbackReport, status: FeedbackReportStatus) {
    if (status.isClosed.isTrue) report.close()
    else if (status.isOpen.isTrue) report.reopen()
    else throw new ConflictError('Estado de relatório não permitido')
  }

  private async publishStatus(
    report: FeedbackReport,
    result: FeedbackReport,
    status: FeedbackReportStatus,
  ) {
    const event = status.isClosed.isTrue
      ? new FeedbackReportClosedEvent({ reportId: report.id.value })
      : new FeedbackReportReopenedEvent({ reportId: report.id.value })
    await this.broker.publish(event, this.eventId(report, result, status))
  }

  private eventId(
    report: FeedbackReport,
    result: FeedbackReport,
    status: FeedbackReportStatus,
  ) {
    return Text.create(
      `feedback-report-${status.value}:${report.id.value}:${result.lastActivityAt.toISOString()}`,
    )
  }
  private persistStatus(
    report: FeedbackReport,
    expected: FeedbackReportStatus,
    status: FeedbackReportStatus,
  ) {
    this.transition(report, status)
    return this.reports.changeStatus(report, expected)
  }
}
