import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import {
  idSchema,
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'

import {
  SupabaseChallengesRepository,
  SupabaseSolutionsRepository,
} from '@/database/supabase/repositories/challenging'
import {
  FetchSolutionsListController,
  FetchSolutionController,
  PostSolutionController,
  EditSolutionController,
  DeleteSolutionController,
  UpvoteSolutionController,
  ViewSolutionController,
} from '@/rest/controllers/challenging/solutions'
import { HonoRouter } from '../../HonoRouter'
import { AuthMiddleware } from '../../middlewares'
import { HonoHttp } from '../../HonoHttp'
import { ProfileMiddleware } from '../../middlewares/ProfileMiddleware'

export class SolutionsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/solutions')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()

  private registerFetchSolutionRoute(): void {
    this.router.get(
      '/:solutionSlug',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          solutionSlug: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSolutionsRepository(http.getSupabase())
        const controller = new FetchSolutionController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchSolutionsListRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'query',
        z.object({
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
          title: stringSchema,
          sorter: stringSchema,
          challengeId: idSchema.optional(),
          userId: idSchema.optional(),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSolutionsRepository(http.getSupabase())
        const controller = new FetchSolutionsListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerPostSolutionRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'json',
        z.object({
          solutionContent: stringSchema,
          solutionTitle: stringSchema,
          challengeId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const solutionsRepository = new SupabaseSolutionsRepository(http.getSupabase())
        const challengesRepository = new SupabaseChallengesRepository(http.getSupabase())
        const controller = new PostSolutionController(
          solutionsRepository,
          challengesRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerEditSolutionRoute(): void {
    this.router.put(
      '/:solutionId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          solutionId: idSchema,
        }),
      ),
      zValidator(
        'json',
        z.object({
          solutionContent: stringSchema,
          solutionTitle: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSolutionsRepository(http.getSupabase())
        const controller = new EditSolutionController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteSolutionRoute(): void {
    this.router.delete(
      '/:solutionId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          solutionId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSolutionsRepository(http.getSupabase())
        const controller = new DeleteSolutionController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerUpvoteSolutionRoute(): void {
    this.router.post(
      '/:solutionId/upvote',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          solutionId: idSchema,
        }),
      ),
      this.profileMiddleware.appendIsSolutionUpvotedToBody,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSolutionsRepository(http.getSupabase())
        const controller = new UpvoteSolutionController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerViewSolutionRoute(): void {
    this.router.patch(
      '/:solutionSlug/view',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          solutionSlug: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSolutionsRepository(http.getSupabase())
        const controller = new ViewSolutionController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchSolutionRoute()
    this.registerFetchSolutionsListRoute()
    this.registerPostSolutionRoute()
    this.registerEditSolutionRoute()
    this.registerDeleteSolutionRoute()
    this.registerUpvoteSolutionRoute()
    this.registerViewSolutionRoute()
    return this.router
  }
}
