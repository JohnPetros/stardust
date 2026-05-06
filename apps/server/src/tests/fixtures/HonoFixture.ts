import { createAdaptorServer, type ServerType } from '@hono/node-server'

import { HonoApp } from '@/app/hono/HonoApp'

export class HonoFixture {
  private readonly app: HonoApp
  readonly server: ServerType

  constructor() {
    this.app = new HonoApp()
    this.server = createAdaptorServer({ fetch: this.app.hono.fetch })
  }

  async setup() {
    this.app.registerMiddlewares()
    this.app.registerRoutes()
    this.app.setUpErrorHandler()
  }
}
