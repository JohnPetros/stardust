import { Hono } from 'hono'
import z from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import { SupabaseStoriesRepository } from '@/database/supabase/repositories/lesson'
import { FetchStoryController } from '@/rest/controllers/lesson'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class StoriesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/stories')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private fetchStoryRoute(): void {
    this.router.get(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseStoriesRepository(http.getSupabase())
        const controller = new FetchStoryController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchStoryRoute()
    return this.router
  }
}
