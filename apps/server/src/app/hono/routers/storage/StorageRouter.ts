import { Hono } from 'hono'

import { CreateSignedUploadUrl } from '@stardust/core/storage/use-cases'
import { signedUploadUrlSchema } from '@stardust/validation/storage/schemas'

import { SupabaseFileStorageProvider } from '@/provision/storage'
import { CreateSignedUploadUrlController } from '@/rest/controllers/storage'
import { EmbeddingsStorageRouter } from './EmbeddingsStorageRouter'
import { FilesStorageRouter } from './FilesStorageRouter'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'

export class StorageRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/storage')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerCreateSignedUploadUrlRoute(): void {
    this.router.post(
      '/signed-upload-url',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('json', signedUploadUrlSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const storageProvider = new SupabaseFileStorageProvider(http.getSupabase())
        const createSignedUploadUrl = new CreateSignedUploadUrl(storageProvider)
        const controller = new CreateSignedUploadUrlController(createSignedUploadUrl)
        const response = await controller.handle(http)

        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    const embeddingsStorageRouter = new EmbeddingsStorageRouter(this.app)
    const filesStorageRouter = new FilesStorageRouter(this.app)

    this.registerCreateSignedUploadUrlRoute()
    this.router.route('/', embeddingsStorageRouter.registerRoutes())
    this.router.route('/', filesStorageRouter.registerRoutes())
    return this.router
  }
}
