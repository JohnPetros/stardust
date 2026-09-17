import { Hono } from 'hono'
import { z } from 'zod'

import { roadmapNodeKeySchema } from '@stardust/validation/challenging/schemas'
import {
  GetChallengeRoadmapUseCase,
  ListRoadmapNodeChallengesUseCase,
} from '@stardust/core/challenging/use-cases'

import { SupabaseChallengeRoadmapsRepository } from '@/database/supabase/repositories/challenging'
import {
  FetchChallengeRoadmapController,
  ListRoadmapNodeChallengesController,
} from '@/rest/controllers/challenging/roadmap'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { ProfileMiddleware, ValidationMiddleware } from '../../middlewares'

export class ChallengeRoadmapRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/roadmap')
  private readonly profileMiddleware = new ProfileMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerFetchRoadmapRoute() {
    this.router.get(
      '/',
      this.profileMiddleware.appendUserCompletedChallengesIdsToBody,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengeRoadmapsRepository(http.getSupabase())
        const useCase = new GetChallengeRoadmapUseCase(repository)
        const controller = new FetchChallengeRoadmapController(useCase)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchRoadmapNodeChallengesRoute() {
    this.router.get(
      '/nodes/:nodeKey/challenges',
      this.profileMiddleware.appendUserCompletedChallengesIdsToBody,
      this.validationMiddleware.validate(
        'param',
        z.object({ nodeKey: roadmapNodeKeySchema }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengeRoadmapsRepository(http.getSupabase())
        const useCase = new ListRoadmapNodeChallengesUseCase(repository)
        const controller = new ListRoadmapNodeChallengesController(useCase)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchRoadmapRoute()
    this.registerFetchRoadmapNodeChallengesRoute()
    return this.router
  }
}
