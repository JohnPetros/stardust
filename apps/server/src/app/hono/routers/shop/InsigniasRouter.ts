import { Hono } from 'hono'
import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'
import { insigniaSchema } from '@stardust/validation/shop/schemas'

import {
  FetchInsigniasListController,
  CreateInsigniaController,
  UpdateInsigniaController,
  DeleteInsigniaController,
} from '@/rest/controllers/shop'
import { SupabaseInsigniasRepository } from '@/database'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class InsigniasRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/insignias')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private fetchInsigniasListRoute(): void {
    this.router.get('/', async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabaseInsigniasRepository(http.getSupabase())
      const controller = new FetchInsigniasListController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private createInsigniaRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('json', insigniaSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseInsigniasRepository(http.getSupabase())
        const controller = new CreateInsigniaController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private updateInsigniaRoute(): void {
    this.router.put(
      '/:insigniaId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          insigniaId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', insigniaSchema),
      async (context) => {
        const http = new HonoHttp(context) as any
        const repository = new SupabaseInsigniasRepository(http.getSupabase())
        const controller = new UpdateInsigniaController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private deleteInsigniaRoute(): void {
    this.router.delete(
      '/:insigniaId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          insigniaId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseInsigniasRepository(http.getSupabase())
        const controller = new DeleteInsigniaController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchInsigniasListRoute()
    this.createInsigniaRoute()
    this.updateInsigniaRoute()
    this.deleteInsigniaRoute()
    return this.router
  }
}
