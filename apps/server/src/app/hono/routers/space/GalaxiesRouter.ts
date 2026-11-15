import { Hono } from 'hono'
import { z } from 'zod'

import { galaxySlugSchema } from '@stardust/validation/space/schemas'

import {
  DrizzleGalaxiesRepository,
  DrizzlePlanetsRepository,
  DrizzleUsersRepository,
} from '@/database/drizzle/repositories'
import {
  ListGalaxiesController,
  ListGalaxyPlanetsController,
} from '@/rest/controllers/space/galaxies'
import { SyncCurrentGalaxyController } from '@/rest/controllers/profile'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import {
  AuthMiddleware,
  ProfileMiddleware,
  SpaceMiddleware,
  ValidationMiddleware,
} from '../../middlewares'

export class GalaxiesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/galaxies')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()
  private readonly spaceMiddleware = new SpaceMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerListGalaxiesRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.appendUserGalaxyProgressToBody,
      async (context) => {
        const http = new HonoHttp(context)
        const galaxiesRepository = new DrizzleGalaxiesRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const controller = new ListGalaxiesController(galaxiesRepository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerSyncCurrentGalaxyRoute(): void {
    this.router.get(
      '/current',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.appendUserCurrentGalaxyToBody,
      this.spaceMiddleware.resolveCurrentGalaxy,
      async (context) => {
        const http = new HonoHttp(context)
        const usersRepository = new DrizzleUsersRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const controller = new SyncCurrentGalaxyController(usersRepository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerListGalaxyPlanetsRoute(): void {
    this.router.get(
      '/:galaxySlug/planets',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          galaxySlug: galaxySlugSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const galaxiesRepository = new DrizzleGalaxiesRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const planetsRepository = new DrizzlePlanetsRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const controller = new ListGalaxyPlanetsController(
          galaxiesRepository,
          planetsRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerListGalaxiesRoute()
    this.registerSyncCurrentGalaxyRoute()
    this.registerListGalaxyPlanetsRoute()
    return this.router
  }
}
