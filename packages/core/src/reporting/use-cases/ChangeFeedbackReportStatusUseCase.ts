import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import { ConflictError } from '#global/domain/errors/ConflictError'
import { Id } from '#global/domain/structures/Id'
import { FeedbackReportNotFoundError } from '../domain/errors'
import { FeedbackReportStatus } from '../domain/structures/FeedbackReportStatus'
import type { FeedbackReportsRepository } from '../interfaces'
import type { ChangeFeedbackReportStatusUseCaseRequest } from '../domain/types'
import { Text } from '#global/domain/structures/Text'
import { FeedbackReportClosedEvent, FeedbackReportReopenedEvent } from '../domain/events'

export class ChangeFeedbackReportStatusUseCase
  implements
    UseCase<
      ChangeFeedbackReportStatusUseCaseRequest,
      Promise<import('../domain/entities/dtos').FeedbackReportDto>
    >
{
  constructor(
    private readonly reports: FeedbackReportsRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: ChangeFeedbackReportStatusUseCaseRequest) {
    const report = await this.reports.findById(Id.create(request.feedbackReportId))
    if (!report) throw new FeedbackReportNotFoundError()
    const expected = FeedbackReportStatus.create(request.expectedStatus)
    if (report.status.value !== expected.value)
      throw new ConflictError(`Estado canônico: ${report.status.value}`)
    const status = FeedbackReportStatus.create(request.status)
    if (status.isClosed.isTrue) report.close()
    else if (status.isOpen.isTrue) report.reopen()
    else throw new ConflictError('Estado de relatório não permitido')
    const result = await this.reports.changeStatus(report, expected)
    const event = status.isClosed.isTrue
      ? new FeedbackReportClosedEvent({ reportId: report.id.value })
      : new FeedbackReportReopenedEvent({ reportId: report.id.value })
    await this.broker.publish(
      event,
      Text.create(
        `feedback-report-${status.value}:${report.id.value}:${result.lastActivityAt.toISOString()}`,
      ),
    )
    return result.dto
  }
}
