import { Hono } from 'hono'
import { SupabasePlanetsRepository } from '@/database'

import { FetchAllPlanetsController } from '@/rest/controllers/space/planets'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware } from '../../middlewares'

export class PlanetsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/planets')
  private readonly authMiddleware = new AuthMiddleware()

  private fetchAllPlanetsRoute(): void {
    this.router.get('/', this.authMiddleware.verifyAuthentication, async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabasePlanetsRepository(http.getSupabase())
      const controller = new FetchAllPlanetsController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  registerRoutes(): Hono {
    this.fetchAllPlanetsRoute()
    return this.router
  }
}
