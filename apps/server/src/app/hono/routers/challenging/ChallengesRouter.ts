import { Hono } from 'hono'
import { z } from 'zod'

import {
  idSchema,
  idsListSchema,
  itemsPerPageSchema,
  pageSchema,
  queryParamBooleanSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'
import {
  challengeSchema,
  challengeVoteSchema,
} from '@stardust/validation/challenging/schemas'

import { SupabaseChallengesRepository } from '@/database/supabase/repositories/challenging'
import {
  FetchChallengeController,
  FetchChallengesListController,
  FetchCompletedChallengesCountByDifficultyLevelController,
  FetchAllChallengeCategoriesController,
  FetchChallengeVoteController,
  VoteChallengeController,
  PostChallengeController,
  UpdateChallengeController,
  DeleteChallengeController,
  FetchPostedChallengesKpiController,
  FetchAllChallengesController,
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

  private registerFetchChallengeByIdRoute(): void {
    this.router.get(
      '/id/:challengeId',
      this.validationMiddleware.validate('param', z.object({ challengeId: idSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new FetchChallengeController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchChallengeBySlugRoute(): void {
    this.router.get(
      '/slug/:challengeSlug',
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
      '/list',
      this.profileMiddleware.appendUserCompletedChallengesIdsToBody,
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
          shouldIncludeOnlyAuthorChallenges: queryParamBooleanSchema.default('false'),
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

  private registerFetchAllChallengesRoute(): void {
    this.router.get(
      '/',
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
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new FetchAllChallengesController(repository)
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
          challengeId: idSchema,
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

  private registerPostChallengeRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.verifyUserEngineerInsignia,
      this.validationMiddleware.validate('json', challengeSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new PostChallengeController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerUpdateChallengeRoute(): void {
    this.router.put(
      '/:challengeId',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.verifyUserEngineerInsignia,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', challengeSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new UpdateChallengeController(repository)
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

  private registerDeleteChallengeRoute(): void {
    this.router.delete(
      '/:challengeId',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.verifyUserEngineerInsignia,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new DeleteChallengeController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchAllChallengeCategoriesRoute(): void {
    this.router.get(
      '/categories',
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

  private registerFetchPostedChallengesKpiRoute(): void {
    this.router.get(
      '/posted-challenges-kpi',
      this.authMiddleware.verifyAuthentication,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new FetchPostedChallengesKpiController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchChallengeByIdRoute()
    this.registerFetchChallengeBySlugRoute()
    this.registerFetchChallengeByStarRoute()
    this.registerFetchChallengesListRoute()
    this.registerFetchAllChallengesRoute()
    this.registerFetchCompletedChallengesByDifficultyLevelRoute()
    this.registerFetchAllChallengeCategoriesRoute()
    this.registerFetchChallengeVoteRoute()
    this.registerVoteChallengeRoute()
    this.registerPostChallengeRoute()
    this.registerUpdateChallengeRoute()
    this.registerDeleteChallengeRoute()
    this.registerFetchPostedChallengesKpiRoute()
    return this.router
  }
}
