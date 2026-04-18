import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { FeedbackRouter } from './FeedbackRouter'

export class ReportingRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/reporting')

  registerRoutes(): Hono {
    const feedbackRouter = new FeedbackRouter(this.app)

    this.router.route('/', feedbackRouter.registerRoutes())

    return this.router
  }
}
