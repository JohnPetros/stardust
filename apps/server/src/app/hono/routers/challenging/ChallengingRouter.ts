import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { ChallengeSourcesRouter } from './ChallengeSourcesRouter'
import { ChallengesRouter } from './ChallengesRouter'
import { SolutionsRouter } from './SolutionsRouter'

export class ChallengingRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/challenging')

  registerRoutes(): Hono {
    const challengesRouter = new ChallengesRouter(this.app)
    const challengeSourcesRouter = new ChallengeSourcesRouter(this.app)
    const solutionsRouter = new SolutionsRouter(this.app)
    this.router.route('/', challengesRouter.registerRoutes())
    this.router.route('/', challengeSourcesRouter.registerRoutes())
    this.router.route('/', solutionsRouter.registerRoutes())
    return this.router
  }
}
