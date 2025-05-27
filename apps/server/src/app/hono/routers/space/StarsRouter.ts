import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { HonoSchema } from '../../types'

import { stringSchema } from '@stardust/validation/global/schemas'

import { FetchStarController } from '@/rest/controllers/space/stars'
import { SupabaseStarsRepository } from '@/database'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'

export class StarsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/stars')

  private fetchStarRoute(): void {
    this.router.get(
      '/:starSlug',
      zValidator(
        'param',
        z.object({
          starSlug: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseStarsRepository(http.getSupabase())
        const controller = new FetchStarController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchStarRoute()
    return this.router
  }
}
