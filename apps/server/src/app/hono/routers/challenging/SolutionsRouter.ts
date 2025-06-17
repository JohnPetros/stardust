import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import {
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'
import { idSchema } from '@stardust/validation'

import { SupabaseSolutionsRepository } from '@/database/supabase/repositories/challenging'
import {
  FetchSolutionsListController,
  FetchSolutionController,
} from '@/rest/controllers/challenging/solutions'
import { HonoRouter } from '../../HonoRouter'
import { AuthMiddleware } from '../../middlewares'
import { HonoHttp } from '../../HonoHttp'

export class SolutionsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/solutions')
  private readonly authMiddleware = new AuthMiddleware()

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

  registerRoutes(): Hono {
    this.registerFetchSolutionRoute()
    this.registerFetchSolutionsListRoute()
    return this.router
  }
}
