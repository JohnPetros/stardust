import { Hono } from 'hono'
import { z } from 'zod'

import {
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { FetchAvatarsListController } from '@/rest/controllers/shop'
import { SupabaseAvatarsRepository } from '@/database/supabase/repositories/shop'
import { ValidationMiddleware } from '../../middlewares'

export class AvatarsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/avatars')
  private readonly validationMiddleware = new ValidationMiddleware()

  private fetchAvatarsListRoute(): void {
    this.router.get(
      '/',
      this.validationMiddleware.validate(
        'query',
        z.object({
          search: stringSchema.default(''),
          order: stringSchema,
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAvatarsRepository(http.getSupabase())
        const controller = new FetchAvatarsListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchAvatarsListRoute()
    return this.router
  }
}
