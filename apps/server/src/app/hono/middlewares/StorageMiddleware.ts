import { S3FileStorageProvider } from '@/provision/storage/S3FileStorageProvider'
import { HonoHttp } from '../HonoHttp'
import type { Context, Next } from 'hono'
import { VerifyFileExistsController } from '@/rest/controllers/storage'
import { VerifyGodAccountController } from '@/rest/controllers/auth'
import { ConflictError } from '@stardust/core/global/errors'
import {
  FeedbackImage,
  FeedbackImageStorageKey,
} from '@stardust/core/reporting/structures'

type StoredFeedbackAttachment = {
  storageKey: string
  originalName: string
  mimeType: 'image/png' | 'image/jpeg'
  size: number
}

export class StorageMiddleware {
  async verifyFileExists(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const storageProvider = new S3FileStorageProvider()
    const controller = new VerifyFileExistsController('images', storageProvider)
    await controller.handle(http)
  }

  async verifySignedUploadUrlAccess(context: Context, next: Next): Promise<void> {
    const request = (
      context.req as typeof context.req & {
        valid(target: 'json'): { folderPath: string }
      }
    ).valid('json')

    if (request.folderPath === 'images/feedback-reports') {
      await next()
      return
    }

    const controller = new VerifyGodAccountController()
    const http = new HonoHttp(context, next)
    await controller.handle(http)
  }

  verifyFeedbackInitialAttachment = async (
    context: Context,
    next: Next,
  ): Promise<void> => {
    const body = (
      context.req as typeof context.req & {
        valid(target: 'json'): { initialAttachment?: StoredFeedbackAttachment }
      }
    ).valid('json')
    const attachment = body.initialAttachment

    if (attachment) {
      await this.verifyStoredFeedbackAttachment(
        attachment,
        FeedbackImageStorageKey.createForFeedbackReport(attachment.storageKey),
      )
    }

    await next()
  }

  verifyFeedbackMessageAttachments = async (
    context: Context,
    next: Next,
  ): Promise<void> => {
    const params = (
      context.req as typeof context.req & {
        valid(target: 'param'): { feedbackReportId: string }
      }
    ).valid('param')
    const body = (
      context.req as typeof context.req & {
        valid(target: 'json'): {
          messageId: string
          attachments: StoredFeedbackAttachment[]
        }
      }
    ).valid('json')

    for (const attachment of body.attachments) {
      await this.verifyStoredFeedbackAttachment(
        attachment,
        FeedbackImageStorageKey.createForFeedbackMessage(
          attachment.storageKey,
          params.feedbackReportId,
          body.messageId,
        ),
      )
    }

    await next()
  }

  private async verifyStoredFeedbackAttachment(
    attachment: StoredFeedbackAttachment,
    storageKey: FeedbackImageStorageKey,
  ): Promise<void> {
    FeedbackImage.createAsOriginal(
      attachment.originalName,
      attachment.mimeType,
      attachment.size,
    )
    FeedbackImage.createAsStored(
      storageKey.fileName.value,
      attachment.mimeType,
      attachment.size,
    )

    const metadata = await new S3FileStorageProvider().getFileMetadata(
      storageKey.folder,
      storageKey.fileName,
    )
    if (
      !metadata ||
      metadata.mimeType !== attachment.mimeType ||
      metadata.size !== attachment.size
    ) {
      throw new ConflictError('Metadados da imagem não correspondem ao objeto armazenado')
    }
  }
}
