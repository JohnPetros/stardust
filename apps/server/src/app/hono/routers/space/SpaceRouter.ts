import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { StarsRouter } from './StarsRouter'
import { PlanetsRouter } from './PlanetsRouter'
import { GalaxiesRouter } from './GalaxiesRouter'

export class SpaceRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/space')

  registerRoutes(): Hono {
    const planetsRouter = new PlanetsRouter(this.app)
    const starsRouter = new StarsRouter(this.app)
    const galaxiesRouter = new GalaxiesRouter(this.app)

    this.router.route('/', planetsRouter.registerRoutes())
    this.router.route('/', starsRouter.registerRoutes())
    this.router.route('/', galaxiesRouter.registerRoutes())
    return this.router
  }
}
