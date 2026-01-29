import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { FeedbackRouter } from './FeedbackRouter'

const ROUTE_PREFIX = '/reporting'

export class ReportingRouter extends HonoRouter {
  private readonly router = new Hono().basePath(ROUTE_PREFIX)

  registerRoutes(): Hono {
    const feedbackRouter = new FeedbackRouter(this.app)

    this.router.route('/', feedbackRouter.registerRoutes())

    return this.router
  }
}
