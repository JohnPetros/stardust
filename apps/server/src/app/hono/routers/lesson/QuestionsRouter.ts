import { Hono } from 'hono'
import z from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import { SupabaseQuestionsRepository } from '@/database/supabase/repositories/lesson'
import {
  FetchQuestionsController,
  UpdateQuestionsController,
} from '@/rest/controllers/lesson'
import { AuthMiddleware, SpaceMiddleware, ValidationMiddleware } from '../../middlewares'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'

export class QuestionsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/questions')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly spaceMiddleware = new SpaceMiddleware()

  private fetchQuestionsRoute(): void {
    this.router.get(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseQuestionsRepository(http.getSupabase())
        const controller = new FetchQuestionsController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private updateQuestionsRoute(): void {
    this.router.put(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.validationMiddleware.validate(
        'json',
        z.object({ questions: z.array(z.any()) }),
      ),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseQuestionsRepository(http.getSupabase())
        const controller = new UpdateQuestionsController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchQuestionsRoute()
    this.updateQuestionsRoute()
    return this.router
  }
}
