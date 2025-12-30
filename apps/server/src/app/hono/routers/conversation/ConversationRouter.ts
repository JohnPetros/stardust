import { Hono } from 'hono'
import { ChatsRouter } from './ChatsRouter'
import { HonoRouter } from '../../HonoRouter'

export class ConversationRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/conversation')

  registerRoutes(): Hono {
    const chatsRouter = new ChatsRouter(this.app)
    this.router.route('/', chatsRouter.registerRoutes())
    return this.router
  }
}
