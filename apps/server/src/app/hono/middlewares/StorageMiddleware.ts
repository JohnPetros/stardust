import { SupabaseStorageProvider } from '@/provision/storage'
import { HonoHttp } from '../HonoHttp'
import type { Context, Next } from 'hono'
import { VerifyFileExistsController } from '@/rest/controllers/storage'

export class StorageMiddleware {
  async verifyFileExists(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const storageProvider = new SupabaseStorageProvider()
    const controller = new VerifyFileExistsController('images', storageProvider)
    await controller.handle(http)
  }
}
