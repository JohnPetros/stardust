import { SupabaseFileStorageProvider } from '@/provision/storage/SupabaseFileStorageProvider'
import { HonoHttp } from '../HonoHttp'
import type { Context, Next } from 'hono'
import { VerifyFileExistsController } from '@/rest/controllers/storage'

export class StorageMiddleware {
  async verifyFileExists(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const storageProvider = new SupabaseFileStorageProvider(http.getSupabase())
    const controller = new VerifyFileExistsController('images', storageProvider)
    await controller.handle(http)
  }
}
