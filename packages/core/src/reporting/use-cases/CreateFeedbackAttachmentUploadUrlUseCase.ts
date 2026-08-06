import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { AppError } from '#global/domain/errors/AppError'
import { Integer } from '#global/domain/structures/Integer'
import { Text } from '#global/domain/structures/Text'
import { FileStorageFolderPath } from '#storage/domain/structures/FileStorageFolderPath'
import type { SignedUploadUrlDto } from '#storage/domain/structures/dtos/SignedUploadUrlDto'
import type { FileStorageProvider } from '#storage/interfaces/FileStorageProvider'
import { FeedbackReportNotFoundError } from '../domain/errors'
import { NotAllowedError } from '#global/domain/errors/NotAllowedError'
import type { FeedbackReportsRepository } from '../interfaces'
import type { CreateFeedbackAttachmentUploadUseCaseRequest } from '../domain/types'

export class CreateFeedbackAttachmentUploadUrlUseCase
  implements
    UseCase<CreateFeedbackAttachmentUploadUseCaseRequest, Promise<SignedUploadUrlDto>>
{
  constructor(
    private readonly reports: FeedbackReportsRepository,
    private readonly storage: FileStorageProvider,
  ) {}

  async execute(request: CreateFeedbackAttachmentUploadUseCaseRequest) {
    const reportId = Id.create(request.feedbackReportId)
    const messageId = Id.create(request.messageId)
    const report = await this.reports.findById(reportId)
    if (!report) throw new FeedbackReportNotFoundError()
    if (
      request.actor.role !== 'admin' &&
      report.author.id.value !== request.actor.accountId
    ) {
      throw new NotAllowedError('A conta não pode responder a este relatório')
    }
    if (report.status.isClosed.isTrue)
      throw new NotAllowedError('Relatório de feedback fechado')
    const fileName = request.fileName.value
    if (!/^[0-9a-f-]{36}\.(png|jpg|jpeg)$/i.test(fileName)) {
      throw new AppError('O nome do anexo deve ser um UUID com extensão PNG ou JPG')
    }
    Integer.create(request.size.value)
    const folder = FileStorageFolderPath.createAsFeedbackMessages(
      reportId.value,
      messageId.value,
    )
    return (await this.storage.createSignedUploadUrl(folder, Text.create(fileName))).dto
  }
}
