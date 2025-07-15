import { Hono } from 'hono'

import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { FetchRocketsListController } from '@/rest/controllers/shop'
import { SupabaseRocketsRepository } from '@/database/supabase/repositories/shop'
import {
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'

export class RocketsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/rockets')

  private fetchRocketsListRoute(): void {
    this.router.get(
      '/',
      zValidator(
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
        const repository = new SupabaseRocketsRepository(http.getSupabase())
        const controller = new FetchRocketsListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchRocketsListRoute()
    return this.router
  }
}
