import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { DocsRouter } from './DocsRouter'

export class DocumentationRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/documentation')

  registerRoutes(): Hono {
    const docsRouter = new DocsRouter(this.app)
    this.router.route('/', docsRouter.registerRoutes())
    return this.router
  }
}
