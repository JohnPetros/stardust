import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import type { FeedbackReportDto } from '../domain/entities/dtos'
import type { FeedbackReportsRepository } from '../interfaces/FeedbackReportsRepository'
import { FeedbackReport } from '../domain/entities'
import { FeedbackReportSentEvent } from '../domain/events'
import type { FileStorageProvider } from '#storage/interfaces/FileStorageProvider'
import type { SendFeedbackReportRequest } from '../domain/types'
import { validateStoredFeedbackAttachment } from './feedbackAttachmentValidation'

type Request = SendFeedbackReportRequest | FeedbackReportDto
type Response = Promise<FeedbackReportDto>

export class SendFeedbackReportUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: FeedbackReportsRepository,
    private readonly broker: Broker,
    private readonly storage?: FileStorageProvider,
  ) {}

  async execute(request: Request): Response {
    const initialAttachment =
      'initialAttachment' in request ? request.initialAttachment : undefined

    if (initialAttachment) {
      if (!this.storage) {
        throw new Error('O armazenamento é necessário para validar a imagem inicial')
      }
      await validateStoredFeedbackAttachment(this.storage, initialAttachment)
    }

    const report = FeedbackReport.create({
      ...request,
      screenshot:
        initialAttachment?.storageKey ??
        ('screenshot' in request ? request.screenshot : undefined),
    })
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
