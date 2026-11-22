import type { Context, Next } from 'hono'

import {
  DrizzleGalaxiesRepository,
  DrizzlePlanetsRepository,
  DrizzleStarsRepository,
} from '@/database/drizzle/repositories'
import {
  AppendEnterableGalaxyToBodyController,
  ResolveCurrentGalaxyController,
} from '@/rest/controllers/space/galaxies'
import { AppendOpenablePlanetToBodyController } from '@/rest/controllers/space/planets'
import {
  AppendStarCompletionToBodyController,
  VerifyStarExistsController,
} from '@/rest/controllers/space/stars'
import { HonoHttp } from '../HonoHttp'

export class SpaceMiddleware {
  async appendStarCompletionToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const starsRepository = new DrizzleStarsRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const planetsRepository = new DrizzlePlanetsRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const galaxiesRepository = new DrizzleGalaxiesRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new AppendStarCompletionToBodyController(
      starsRepository,
      planetsRepository,
      galaxiesRepository,
    )
    await controller.handle(http)
  }

  async appendOpenablePlanetToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const planetsRepository = new DrizzlePlanetsRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new AppendOpenablePlanetToBodyController(planetsRepository)
    await controller.handle(http)
  }

  async resolveCurrentGalaxy(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const galaxiesRepository = new DrizzleGalaxiesRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new ResolveCurrentGalaxyController(galaxiesRepository)
    await controller.handle(http)
  }

  async appendEnterableGalaxyToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const galaxiesRepository = new DrizzleGalaxiesRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new AppendEnterableGalaxyToBodyController(galaxiesRepository)
    await controller.handle(http)
  }

  async verifyStarExists(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const starsRepository = new DrizzleStarsRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new VerifyStarExistsController(starsRepository)
    await controller.handle(http)
  }
}
