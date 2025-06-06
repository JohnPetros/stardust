import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { StarsRouter } from './StarsRouter'
import { PlanetsRouter } from './PlanetsRouter'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware'

export class SpaceRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/space')

  registerRoutes(): Hono {
    const starsRouter = new StarsRouter(this.app)
    const planetsRouter = new PlanetsRouter(this.app)

    this.router.route('/', starsRouter.registerRoutes())
    this.router.route('/', planetsRouter.registerRoutes())
    return this.router
  }
}
