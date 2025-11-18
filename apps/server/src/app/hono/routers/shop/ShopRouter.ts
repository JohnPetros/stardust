import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { AvatarsRouter } from './AvatarsRouter'
import { RocketsRouter } from './RocketsRouter'
import { InsigniasRouter } from './InsigniasRouter'

export class ShopRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/shop')

  registerRoutes(): Hono {
    const rocketsRouter = new RocketsRouter(this.app)
    const avatarsRouter = new AvatarsRouter(this.app)
    const insigniasRouter = new InsigniasRouter(this.app)

    this.router.route('/', rocketsRouter.registerRoutes())
    this.router.route('/', avatarsRouter.registerRoutes())
    this.router.route('/', insigniasRouter.registerRoutes())
    return this.router
  }
}
