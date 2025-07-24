import { Hono } from 'hono'
import z from 'zod'

import { idSchema, stringSchema } from '@stardust/validation/global/schemas'

import { SupabaseStoriesRepository } from '@/database/supabase/repositories/lesson'
import { FetchStoryController, UpdateStoryController } from '@/rest/controllers/lesson'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, SpaceMiddleware, ValidationMiddleware } from '../../middlewares'

export class StoriesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/stories')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly spaceMiddleware = new SpaceMiddleware()

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

  private registerUpdateStoryRoute(): void {
    this.router.put(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          starId: idSchema,
        }),
      ),
      this.validationMiddleware.validate(
        'json',
        z.object({
          story: stringSchema,
        }),
      ),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const storiesRepository = new SupabaseStoriesRepository(http.getSupabase())
        const controller = new UpdateStoryController(storiesRepository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchStoryRoute()
    this.registerUpdateStoryRoute()
    return this.router
  }
}
