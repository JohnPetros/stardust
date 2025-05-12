import { Hono } from 'hono'
import { UsersRouter } from './UsersRouter'
import { HonoRouter } from '../../HonoRouter'

export class ProfileRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/profile')

  registerRoutes(): Hono {
    const usersRouter = new UsersRouter(this.app)
    this.router.route('/', usersRouter.registerRoutes())
    return this.router
  }
}
