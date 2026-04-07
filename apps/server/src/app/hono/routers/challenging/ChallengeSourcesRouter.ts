import { Hono } from 'hono'
import { z } from 'zod'

import {
  idSchema,
  itemsPerPageSchema,
  pageSchema,
} from '@stardust/validation/global/schemas'
import { challengeSourceSchema } from '@stardust/validation/challenging/schemas'

import {
  SupabaseChallengesRepository,
  SupabaseChallengeSourcesRepository,
} from '@/database/supabase/repositories/challenging'
import {
  DeleteChallengeSourceController,
  FetchChallengeSourcesListController,
  CreateChallengeSourceController,
  ReorderChallengeSourcesController,
  UpdateChallengeSourceController,
} from '@/rest/controllers/challenging/sources'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class ChallengeSourcesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/challenge-sources')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerFetchChallengeSourcesListRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'query',
        z.object({
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
          title: z.string().default(''),
          positionOrder: z.enum(['ascending', 'descending', 'all']).optional(),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengeSourcesRepository(http.getSupabase())
        const controller = new FetchChallengeSourcesListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerCreateChallengeSourceRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('json', challengeSourceSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const challengeSourcesRepository = new SupabaseChallengeSourcesRepository(
          supabase,
        )
        const challengesRepository = new SupabaseChallengesRepository(supabase)
        const controller = new CreateChallengeSourceController(
          challengeSourcesRepository,
          challengesRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteChallengeSourceRoute(): void {
    this.router.delete(
      '/:challengeSourceId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeSourceId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengeSourcesRepository(http.getSupabase())
        const controller = new DeleteChallengeSourceController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerUpdateChallengeSourceRoute(): void {
    this.router.put(
      '/:challengeSourceId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeSourceId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', challengeSourceSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const challengeSourcesRepository = new SupabaseChallengeSourcesRepository(
          supabase,
        )
        const challengesRepository = new SupabaseChallengesRepository(supabase)
        const controller = new UpdateChallengeSourceController(
          challengeSourcesRepository,
          challengesRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerReorderChallengeSourcesRoute(): void {
    this.router.patch(
      '/order',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'json',
        z.object({
          challengeSourceIds: z.array(idSchema),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChallengeSourcesRepository(http.getSupabase())
        const controller = new ReorderChallengeSourcesController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchChallengeSourcesListRoute()
    this.registerCreateChallengeSourceRoute()
    this.registerUpdateChallengeSourceRoute()
    this.registerDeleteChallengeSourceRoute()
    this.registerReorderChallengeSourcesRoute()
    return this.router
  }
}
