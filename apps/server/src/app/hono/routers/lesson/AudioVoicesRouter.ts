import { Hono } from 'hono'

import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'
import { FetchAudioVoicesController } from '@/rest/controllers/lesson'

export class AudioVoicesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/audio-voices')

  private fetchAudioVoicesRoute(): void {
    this.router.get('/', async (context) => {
      const http = new HonoHttp(context)
      const controller = new FetchAudioVoicesController()
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  registerRoutes(): Hono {
    this.fetchAudioVoicesRoute()
    return this.router
  }
}
