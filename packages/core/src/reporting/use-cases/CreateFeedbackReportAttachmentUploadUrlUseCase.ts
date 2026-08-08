import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { Integer } from '#global/domain/structures/Integer'
import { Text } from '#global/domain/structures/Text'
import { FileStorageFolderPath } from '#storage/domain/structures/FileStorageFolderPath'
import type { SignedUploadUrlDto } from '#storage/domain/structures/dtos/SignedUploadUrlDto'
import type { FileStorageProvider } from '#storage/interfaces/FileStorageProvider'
import type { CreateFeedbackReportAttachmentUploadRequest } from '../domain/types'
import { validateFeedbackImageMetadata } from './feedbackAttachmentValidation'

export class CreateFeedbackReportAttachmentUploadUrlUseCase
  implements
    UseCase<CreateFeedbackReportAttachmentUploadRequest, Promise<SignedUploadUrlDto>>
{
  constructor(private readonly storage: FileStorageProvider) {}

  async execute(
    request: CreateFeedbackReportAttachmentUploadRequest,
  ): Promise<SignedUploadUrlDto> {
    Id.create(request.actorId)
    const fileName = request.fileName.value
    const mimeType = request.mimeType.value
    const size = request.size.value
    validateFeedbackImageMetadata(fileName, mimeType, size)
    Integer.create(size)

    return (
      await this.storage.createSignedUploadUrl(
        FileStorageFolderPath.createAsFeedbackReports(),
        Text.create(fileName),
      )
    ).dto
  }
}
