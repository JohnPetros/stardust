import { Hono } from 'hono'
import { z } from 'zod'

import {
  idSchema,
  idsListSchema,
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'
import { challengeVoteSchema } from '@stardust/validation/challenging/schemas'

import { SupabaseChallengesRepository } from '@/database/supabase/repositories/challenging'
import {
  FetchChallengeController,
  FetchChallengesListController,
  FetchCompletedChallengesCountByDifficultyLevelController,
  FetchAllChallengeCategoriesController,
  FetchChallengeVoteController,
  VoteChallengeController,
} from '@/rest/controllers/challenging/challenges'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { ProfileMiddleware } from '../../middlewares/ProfileMiddleware'

export class ChallengesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/challenges')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerFetchChallengeRoute(): void {
    this.router.get(
      '/slug/:challengeSlug',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
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

  private registerFetchChallengeByStarRoute(): void {
    this.router.get(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
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
      this.validationMiddleware.validate(
        'query',
        z.object({
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
          title: stringSchema,
          categoriesIds: idsListSchema,
          difficulty: stringSchema,
          upvotesCountOrder: stringSchema,
          postingOrder: stringSchema,
          userId: stringSchema.optional(),
          completionStatus: stringSchema,
        }),
      ),
      this.profileMiddleware.appendUserCompletedChallengesIdsToBody,
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

  private registerFetchChallengeVoteRoute(): void {
    this.router.get(
      '/:challengeId/vote',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new FetchChallengeVoteController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerVoteChallengeRoute(): void {
    this.router.post(
      '/:challengeId/vote',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      this.validationMiddleware.validate(
        'json',
        z.object({
          challengeVote: challengeVoteSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new VoteChallengeController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchAllChallengeCategoriesRoute(): void {
    this.router.get(
      '/categories',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.appendUserCompletedChallengesIdsToBody,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new FetchAllChallengeCategoriesController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchChallengeRoute()
    this.registerFetchChallengeByStarRoute()
    this.registerFetchChallengesListRoute()
    this.registerFetchCompletedChallengesByDifficultyLevelRoute()
    this.registerFetchAllChallengeCategoriesRoute()
    this.registerFetchChallengeVoteRoute()
    this.registerVoteChallengeRoute()
    return this.router
  }
}
