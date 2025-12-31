import { Hono } from 'hono'

import { EmbeddingsStorageRouter } from './EmbeddingsStorageRouter'
import { FilesStorageRouter } from './FilesStorageRouter'
import { HonoRouter } from '../../HonoRouter'

export class StorageRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/storage')

  registerRoutes(): Hono {
    const embeddingsStorageRouter = new EmbeddingsStorageRouter(this.app)
    const filesStorageRouter = new FilesStorageRouter(this.app)

    this.router.route('/', embeddingsStorageRouter.registerRoutes())
    this.router.route('/', filesStorageRouter.registerRoutes())
    return this.router
  }
}
