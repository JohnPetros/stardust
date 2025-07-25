import { Hono } from 'hono'
import { z } from 'zod'

import { idSchema, stringSchema } from '@stardust/validation/global/schemas'

import { FetchStarController } from '@/rest/controllers/space/stars'
import { SupabaseStarsRepository } from '@/database'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class StarsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/stars')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerFetchStarBySlugRoute(): void {
    this.router.get(
      '/slug/:starSlug',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
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

  private registerFetchStarByIdRoute(): void {
    this.router.get(
      '/id/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          starId: idSchema,
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
    this.registerFetchStarBySlugRoute()
    this.registerFetchStarByIdRoute()
    return this.router
  }
}
