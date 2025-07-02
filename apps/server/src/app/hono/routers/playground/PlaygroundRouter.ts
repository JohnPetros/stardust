import { Hono } from 'hono'
import { HonoRouter } from '../../HonoRouter'
import { SnippetsRouter } from './SnippetsRouter'

export class PlaygroundRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/playground')

  registerRoutes(): Hono {
    const snippetsRouter = new SnippetsRouter(this.app)
    this.router.route('/', snippetsRouter.registerRoutes())
    return this.router
  }
}
