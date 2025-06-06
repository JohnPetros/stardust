import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import {
  idsListSchema,
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'

import { SupabaseChallengesRepository } from '@/database/supabase/repositories/challenging'
import {
  FetchChallengeController,
  FetchChallengesListController,
  FetchCompletedChallengesCountByDifficultyLevelController,
} from '@/rest/controllers/challenging/challenges'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware } from '../../middlewares'
import { ProfileMiddleware } from '../../middlewares/ProfileMiddleware'

export class ChallengesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/challenges')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()

  private registerFetchChallengeRoute(): void {
    this.router.get(
      '/slug/:challengeSlug',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          challengeSlug: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new FetchChallengeController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchChallengesListRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.appendUserCompletedChallengesIdsToBody,
      zValidator(
        'query',
        z.object({
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
          title: stringSchema,
          categoriesIds: idsListSchema.default([]),
          difficulty: stringSchema,
          upvotesCountOrder: stringSchema,
          postingOrder: stringSchema,
          userId: stringSchema.optional(),
          completionStatus: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new FetchChallengesListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchCompletedChallengesByDifficultyLevelRoute(): void {
    this.router.get(
      '/completed-by-difficulty-level',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.appendUserCompletedChallengesIdsToBody,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new FetchCompletedChallengesCountByDifficultyLevelController(
          repository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchChallengeRoute()
    this.registerFetchChallengesListRoute()
    this.registerFetchCompletedChallengesByDifficultyLevelRoute()
    return this.router
  }
}
