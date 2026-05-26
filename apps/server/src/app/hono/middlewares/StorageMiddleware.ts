import { SupabaseFileStorageProvider } from '@/provision/storage/SupabaseFileStorageProvider'
import { HonoHttp } from '../HonoHttp'
import type { Context, Next } from 'hono'
import { VerifyFileExistsController } from '@/rest/controllers/storage'
import { VerifyGodAccountController } from '@/rest/controllers/auth'

export class StorageMiddleware {
  async verifyFileExists(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const storageProvider = new SupabaseFileStorageProvider(http.getSupabase())
    const controller = new VerifyFileExistsController('images', storageProvider)
    await controller.handle(http)
  }

  async verifySignedUploadUrlAccess(context: Context, next: Next): Promise<void> {
    // @ts-ignore
    const request = context.req.valid('json') as { folderPath: string }

    if (request.folderPath === 'images/feedback-reports') {
      await next()
      return
    }

    const controller = new VerifyGodAccountController()
    const http = new HonoHttp(context, next)
    await controller.handle(http)
  }
}
