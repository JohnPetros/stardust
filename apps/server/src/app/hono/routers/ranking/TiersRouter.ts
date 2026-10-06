import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { DrizzleTiersRepository } from '@/database/drizzle/repositories'
import { FetchAllTiersController } from '@/rest/controllers/ranking'
import { AuthMiddleware } from '../../middlewares'

export class TiersRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/tiers')
  private readonly authMiddleware = new AuthMiddleware()

  private fetchAllTiersRoute(): void {
    this.router.get('/', this.authMiddleware.verifyAuthentication, async (context) => {
      const http = new HonoHttp(context)
      const repository = new DrizzleTiersRepository(
        http.getDatabase(),
        http.getDatabaseAccess(),
      )
      const controller = new FetchAllTiersController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  registerRoutes(): Hono {
    this.fetchAllTiersRoute()
    return this.router
  }
}
