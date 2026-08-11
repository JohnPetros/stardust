import { ConflictError } from '#global/domain/errors/ConflictError'

const STORED_IMAGE_FILE_NAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(png|jpg|jpeg)$/i
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg']

export class FeedbackImage {
  private constructor(
    readonly fileName: string,
    readonly mimeType: string,
    readonly size: number,
  ) {}

  static createAsStored(fileName: string, mimeType: string, size: number): FeedbackImage {
    FeedbackImage.validate(fileName, mimeType, size, true)
    return new FeedbackImage(fileName, mimeType, size)
  }

  static createAsOriginal(
    fileName: string,
    mimeType: string,
    size: number,
  ): FeedbackImage {
    FeedbackImage.validate(fileName, mimeType, size, false)
    return new FeedbackImage(fileName, mimeType, size)
  }

  private static validate(
    fileName: string,
    mimeType: string,
    size: number,
    requireUuid: boolean,
  ): void {
    if (!fileName.trim()) {
      throw new ConflictError('Nome original da imagem é obrigatório')
    }
    if (requireUuid && !STORED_IMAGE_FILE_NAME.test(fileName)) {
      throw new ConflictError(
        'O nome da imagem deve ser um UUID com extensão PNG ou JPEG',
      )
    }
    if (!requireUuid && !SUPPORTED_MIME_TYPES.includes(mimeType)) {
      throw new ConflictError('A imagem deve ser PNG ou JPEG')
    }
    if (requireUuid) {
      const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
      const expectedMimeType = extension === '.png' ? 'image/png' : 'image/jpeg'

      if (mimeType !== expectedMimeType) {
        throw new ConflictError('MIME type deve corresponder à extensão da imagem')
      }
    }
    if (!Number.isInteger(size) || size < 1 || size > MAX_IMAGE_SIZE) {
      throw new ConflictError('A imagem deve ter entre 1 byte e 10 MB')
    }
  }
}

export { MAX_IMAGE_SIZE, STORED_IMAGE_FILE_NAME }
