import { Hono } from 'hono'
import z from 'zod'

import { textBlockSchema } from '@stardust/validation/lesson/schemas'
import { idSchema } from '@stardust/validation/global/schemas'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { SupabaseTextBlocksRepository } from '@/database/supabase/repositories/lesson'
import {
  FetchTextBlocksController,
  UpdateTextBlocksController,
} from '@/rest/controllers/lesson'
import { AuthMiddleware, SpaceMiddleware, ValidationMiddleware } from '../../middlewares'

export class TextBlocksRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/text-blocks')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly spaceMiddleware = new SpaceMiddleware()

  private fetchTextBlocksRoute(): void {
    this.router.get(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseTextBlocksRepository(http.getSupabase())
        const controller = new FetchTextBlocksController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private updateTextBlocksRoute(): void {
    this.router.put(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.validationMiddleware.validate(
        'json',
        z.object({ textBlocks: z.array(textBlockSchema) }),
      ),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseTextBlocksRepository(http.getSupabase())
        const controller = new UpdateTextBlocksController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchTextBlocksRoute()
    this.updateTextBlocksRoute()
    return this.router
  }
}
