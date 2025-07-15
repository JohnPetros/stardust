import type { Hono } from 'hono'
import type { HonoApp } from './HonoApp'

export abstract class HonoRouter {
  protected readonly app: HonoApp

  constructor(app: HonoApp) {
    this.app = app
  }

  abstract registerRoutes(): Hono
}
