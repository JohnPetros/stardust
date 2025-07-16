import { Hono } from 'hono'
import z from 'zod'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { SupabaseTextBlocksRepository } from '@/database/supabase/repositories/lesson'
import { FetchTextBlocksController } from '@/rest/controllers/lesson'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { idSchema } from '@stardust/validation/global/schemas'

export class TextBlocksRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/text-blocks')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private fetchTextBlocksRoute(): void {
    this.router.get(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseTextBlocksRepository(http.getSupabase())
        const controller = new FetchTextBlocksController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchTextBlocksRoute()
    return this.router
  }
}
