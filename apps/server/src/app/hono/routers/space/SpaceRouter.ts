import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { StarsRouter } from './StarsRouter'
import { PlanetsRouter } from './PlanetsRouter'

export class SpaceRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/space')

  registerRoutes(): Hono {
    const planetsRouter = new PlanetsRouter(this.app)
    const starsRouter = new StarsRouter(this.app)

    this.router.route('/', planetsRouter.registerRoutes())
    this.router.route('/', starsRouter.registerRoutes())
    return this.router
  }
}
