import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { ChallengeCodeExecutionsRouter } from './ChallengeCodeExecutionsRouter'
import { ChallengeSourcesRouter } from './ChallengeSourcesRouter'
import { ChallengesRouter } from './ChallengesRouter'
import { SolutionsRouter } from './SolutionsRouter'
import { ChallengeRoadmapRouter } from './ChallengeRoadmapRouter'

export class ChallengingRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/challenging')

  registerRoutes(): Hono {
    const challengeCodeExecutionsRouter = new ChallengeCodeExecutionsRouter(this.app)
    const challengesRouter = new ChallengesRouter(this.app)
    const challengeSourcesRouter = new ChallengeSourcesRouter(this.app)
    const solutionsRouter = new SolutionsRouter(this.app)
    const challengeRoadmapRouter = new ChallengeRoadmapRouter(this.app)
    this.router.route('/', challengeCodeExecutionsRouter.registerRoutes())
    this.router.route('/', challengesRouter.registerRoutes())
    this.router.route('/', challengeSourcesRouter.registerRoutes())
    this.router.route('/', solutionsRouter.registerRoutes())
    this.router.route('/', challengeRoadmapRouter.registerRoutes())
    return this.router
  }
}
