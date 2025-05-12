import { Hono } from 'hono'
import { serve } from '@hono/node-server'

import type { RestResponse } from '@stardust/core/global/responses'

import { ENV } from '@/constants'
import { ProfileRouter } from './routers'

export class HonoApp {
  private readonly hono: Hono

  constructor() {
    this.hono = new Hono()
    this.registerRoutes()
  }

  startServer() {
    console.log(ENV.baseUrl)
    serve(
      {
        fetch: this.hono.fetch,
        port: ENV.port,
      },
      (info) => {
        console.log(`Server is running on ${ENV.baseUrl}:${info.port} 🔥`)
      },
    )
  }

  private registerRoutes() {
    const profileRouter = new ProfileRouter(this)
    this.hono.route('/', profileRouter.registerRoutes())
    console.log(this.hono.routes)
  }

  sendRestResponse(response: RestResponse) {
    return response.body as Response
  }
}
