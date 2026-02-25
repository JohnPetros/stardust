import { Hono } from 'hono'
import { z } from 'zod'

import {
  idSchema,
  idsListSchema,
  itemsPerPageSchema,
  listingOrderSchema,
  pageSchema,
  queryParamBooleanSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'
import {
  challengeSchema,
  challengeStarSchema,
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
  EditChallengeStarController,
  RemoveChallengeStarController,
  DeleteChallengeController,
  FetchPostedChallengesKpiController,
  FetchAllChallengesController,
} from '@/rest/controllers/challenging/challenges'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import {
  AuthMiddleware,
  ChallengingMiddleware,
  ValidationMiddleware,
} from '../../middlewares'
import { ProfileMiddleware } from '../../middlewares/ProfileMiddleware'
import { InngestBroker } from '@/queue/inngest/InngestBroker'

export class ChallengesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/challenges')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly challengingMiddleware = new ChallengingMiddleware()
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
          upvotesCountOrder: listingOrderSchema,
          downvoteCountOrder: listingOrderSchema,
          completionCountOrder: listingOrderSchema,
          postingOrder: listingOrderSchema,
          userId: stringSchema.optional(),
          completionStatus: stringSchema,
          shouldIncludeOnlyAuthorChallenges: queryParamBooleanSchema.default('false'),
          shouldIncludePrivateChallenges: queryParamBooleanSchema.default('false'),
          shouldIncludeStarChallenges: queryParamBooleanSchema.default('false'),
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
          upvotesCountOrder: listingOrderSchema,
          downvoteCountOrder: listingOrderSchema,
          completionCountOrder: listingOrderSchema,
          postingOrder: listingOrderSchema,
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
      this.profileMiddleware.verifyUserEngineerOrGodInsignia,
      this.validationMiddleware.validate('json', challengeSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const broker = new InngestBroker()
        const controller = new PostChallengeController(repository, broker)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerUpdateChallengeRoute(): void {
    this.router.put(
      '/:challengeId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      this.challengingMiddleware.verifyChallengeManagementPermission,
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

  private registerEditChallengeStarRoute(): void {
    this.router.patch(
      '/:challengeId/star',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', challengeStarSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new EditChallengeStarController(repository)
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
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      this.challengingMiddleware.verifyChallengeManagementPermission,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new DeleteChallengeController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerRemoveChallengeStarRoute(): void {
    this.router.delete(
      '/:challengeId/star',
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
        const controller = new RemoveChallengeStarController(repository)
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
    this.registerEditChallengeStarRoute()
    this.registerDeleteChallengeRoute()
    this.registerRemoveChallengeStarRoute()
    this.registerFetchPostedChallengesKpiRoute()
    return this.router
  }
}
