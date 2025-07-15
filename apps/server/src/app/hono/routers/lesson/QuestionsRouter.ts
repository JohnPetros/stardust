import { Hono } from 'hono'
import z from 'zod'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { SupabaseQuestionsRepository } from '@/database/supabase/repositories/lesson'
import { FetchQuestionsController } from '@/rest/controllers/lesson'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { idSchema } from '@stardust/validation/global/schemas'

export class QuestionsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/questions')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private fetchQuestionsRoute(): void {
    this.router.get(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseQuestionsRepository(http.getSupabase())
        const controller = new FetchQuestionsController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchQuestionsRoute()
    return this.router
  }
}
