import { Hono } from 'hono'

import { CheckHealthController } from '@/rest/controllers/health'
import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'

export class HealthRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/health')

  registerRoutes(): Hono {
    this.router.get('/', async (context) => {
      const http = new HonoHttp(context)
      const controller = new CheckHealthController()
      const response = await controller.handle(http)

      return http.sendResponse(response)
    })

    return this.router
  }
}
