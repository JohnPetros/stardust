import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { GuidesRouter } from './GuidesRouter'

export class ManualRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/manual')

  registerRoutes(): Hono {
    const guidesRouter = new GuidesRouter(this.app)
    this.router.route('/', guidesRouter.registerRoutes())
    return this.router
  }
}
