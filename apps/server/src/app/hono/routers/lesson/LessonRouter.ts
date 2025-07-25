import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { QuestionsRouter } from './QuestionsRouter'
import { StoriesRouter } from './StoriesRouter'
import { TextBlocksRouter } from './TextBlocksRouter'

export class LessonRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/lesson')

  registerRoutes(): Hono {
    const questionsRouter = new QuestionsRouter(this.app)
    const storiesRouter = new StoriesRouter(this.app)
    const textBlocksRouter = new TextBlocksRouter(this.app)
    this.router.route('/', questionsRouter.registerRoutes())
    this.router.route('/', storiesRouter.registerRoutes())
    this.router.route('/', textBlocksRouter.registerRoutes())
    return this.router
  }
}
