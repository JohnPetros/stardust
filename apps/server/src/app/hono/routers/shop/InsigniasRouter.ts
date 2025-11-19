import { Hono } from 'hono'

import { FetchInsigniasListController } from '@/rest/controllers/shop'
import { SupabaseInsigniasRepository } from '@/database'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'

export class InsigniasRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/insignias')

  private fetchInsigniasListRoute(): void {
    this.router.get('/', async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabaseInsigniasRepository(http.getSupabase())
      const controller = new FetchInsigniasListController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  registerRoutes(): Hono {
    this.fetchInsigniasListRoute()
    return this.router
  }
}
