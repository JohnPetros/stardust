import type { Context, Next } from 'hono'

import { SupabasePlanetsRepository, SupabaseStarsRepository } from '@/database'
import { InngestEventBroker } from '@/queue/inngest/InngestEventBroker'
import {
  AppendNextStarToBodyController,
  VerifyStarExistsController,
} from '@/rest/controllers/space/stars'
import { HonoHttp } from '../HonoHttp'

export class SpaceMiddleware {
  async appendNextStarToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const eventBroker = new InngestEventBroker()
    const starsRepository = new SupabaseStarsRepository(http.getSupabase())
    const planetsRepository = new SupabasePlanetsRepository(http.getSupabase())
    const controller = new AppendNextStarToBodyController(
      starsRepository,
      planetsRepository,
      eventBroker,
    )
    await controller.handle(http)
  }

  async verifyStarExists(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const starsRepository = new SupabaseStarsRepository(http.getSupabase())
    const controller = new VerifyStarExistsController(starsRepository)
    await controller.handle(http)
  }
}
