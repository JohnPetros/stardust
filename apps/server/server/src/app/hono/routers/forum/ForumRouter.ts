import { Hono } from 'hono'
import { CommentsRouter } from './CommentsRouter'
import { HonoRouter } from '../../HonoRouter'

export class ForumRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/forum')

  registerRoutes(): Hono {
    const commentsRouter = new CommentsRouter(this.app)
    this.router.route('/', commentsRouter.registerRoutes())
    return this.router
  }
}
