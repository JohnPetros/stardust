import { ConflictError } from '#global/domain/errors/ConflictError'
import { Text } from '#global/domain/structures/Text'
import { FileStorageFolderPath } from '#storage/domain/structures/FileStorageFolderPath'
import type { FeedbackInitialAttachmentRequest } from '../domain/types'
import type { FileStorageProvider } from '#storage/interfaces/FileStorageProvider'

const IMAGE_FILE_NAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(png|jpg|jpeg)$/i
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

export function validateFeedbackImageMetadata(
  fileName: string,
  mimeType: string,
  size: number,
  requireUuid = true,
): void {
  const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
  const expectedMimeType = extension === '.png' ? 'image/png' : 'image/jpeg'

  if (
    (requireUuid && !IMAGE_FILE_NAME.test(fileName)) ||
    (!requireUuid && !/\.(png|jpg|jpeg)$/i.test(fileName))
  ) {
    throw new ConflictError('O nome da imagem deve ser um UUID com extensão PNG ou JPEG')
  }
  if (mimeType !== expectedMimeType) {
    throw new ConflictError('MIME type deve corresponder à extensão da imagem')
  }
  if (!Number.isInteger(size) || size < 1 || size > MAX_IMAGE_SIZE) {
    throw new ConflictError('A imagem deve ter entre 1 byte e 10 MB')
  }
}

export async function validateStoredFeedbackAttachment(
  storage: FileStorageProvider,
  attachment: FeedbackInitialAttachmentRequest,
): Promise<void> {
  const folder = FileStorageFolderPath.createAsFeedbackReports()
  const prefix = `${folder.value}/`
  if (
    !attachment.storageKey.startsWith(prefix) ||
    attachment.storageKey.includes('/', prefix.length)
  ) {
    throw new ConflictError('Chave de storage da imagem inválida')
  }

  const fileName = attachment.storageKey.slice(prefix.length)
  if (fileName !== attachment.storageKey.split('/').at(-1)) {
    throw new ConflictError('Chave de storage da imagem inválida')
  }
  validateFeedbackImageMetadata(
    attachment.originalName,
    attachment.mimeType,
    attachment.size,
    false,
  )
  validateFeedbackImageMetadata(fileName, attachment.mimeType, attachment.size)

  const metadata = await storage.getFileMetadata(folder, Text.create(fileName))
  if (
    !metadata ||
    metadata.mimeType !== attachment.mimeType ||
    metadata.size !== attachment.size
  ) {
    throw new ConflictError('Metadados da imagem não correspondem ao objeto armazenado')
  }
}

export { IMAGE_FILE_NAME, MAX_IMAGE_SIZE }
