import { Hono } from 'hono'
import { UsersRouter } from './UsersRouter'
import { HonoRouter } from '../../HonoRouter'
import { AchievementsRouter } from './AchievementsRouter'
import { AuthMiddleware } from '../../middlewares'

export class ProfileRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/profile')

  registerRoutes(): Hono {
    const usersRouter = new UsersRouter(this.app)
    const achievementsRouter = new AchievementsRouter(this.app)

    this.router.route('/', usersRouter.registerRoutes())
    this.router.route('/', achievementsRouter.registerRoutes())
    return this.router
  }
}
