import { ConflictError } from '#global/domain/errors/ConflictError'
import { Text } from '#global/domain/structures/Text'
import { FileStorageFolderPath } from '#storage/domain/structures/FileStorageFolderPath'
import { STORED_IMAGE_FILE_NAME } from './FeedbackImage'

export class FeedbackImageStorageKey {
  private constructor(
    readonly folder: FileStorageFolderPath,
    readonly fileName: Text,
  ) {}

  static createForFeedbackReport(storageKey: string): FeedbackImageStorageKey {
    return FeedbackImageStorageKey.create(
      storageKey,
      FileStorageFolderPath.createAsFeedbackReports(),
      'Chave de storage da imagem inválida',
    )
  }

  static createForFeedbackMessage(
    storageKey: string,
    feedbackReportId: string,
    feedbackMessageId: string,
  ): FeedbackImageStorageKey {
    return FeedbackImageStorageKey.create(
      storageKey,
      FileStorageFolderPath.createAsFeedbackMessages(feedbackReportId, feedbackMessageId),
      'Anexo fora da pasta do relatório',
    )
  }

  private static create(
    storageKey: string,
    folder: FileStorageFolderPath,
    folderErrorMessage: string,
  ): FeedbackImageStorageKey {
    const prefix = `${folder.value}/`
    if (!storageKey.startsWith(prefix) || storageKey.includes('/', prefix.length)) {
      throw new ConflictError(folderErrorMessage)
    }

    const fileName = storageKey.slice(prefix.length)
    if (!STORED_IMAGE_FILE_NAME.test(fileName)) {
      throw new ConflictError(
        folder.value === 'images/feedback-reports'
          ? 'Chave de storage da imagem inválida'
          : 'Chave de storage do anexo inválida',
      )
    }

    return new FeedbackImageStorageKey(folder, Text.create(fileName))
  }
}
