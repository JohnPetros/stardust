import { Hono } from 'hono'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { FetchAllPlanetsController } from '@/rest/controllers/space/planets'
import { SupabasePlanetsRepository } from '@/database'

export class PlanetsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/planets')

  private fetchAllPlanetsRoute(): void {
    this.router.get('/', async (context) => {
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
