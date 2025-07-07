import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { SupabaseTiersRepository } from '@/database/supabase/repositories/ranking'
import { FetchTiersController } from '@/rest/controllers/ranking'
import { AuthMiddleware } from '../../middlewares'

export class TiersRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/tiers')
  private readonly authMiddleware = new AuthMiddleware()

  private fetchTiersRoute(): void {
    this.router.get('/', this.authMiddleware.verifyAuthentication, async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabaseTiersRepository(http.getSupabase())
      const controller = new FetchTiersController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  registerRoutes(): Hono {
    this.fetchTiersRoute()
    return this.router
  }
}
