import { Hono } from 'hono'
import z from 'zod'

import { SupabasePlanetsRepository, SupabaseStarsRepository } from '@/database'
import {
  FetchAllPlanetsController,
  CreatePlanetStarController,
  ReorderPlanetStarsController,
  DeletePlanetStarController,
} from '@/rest/controllers/space/planets'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { idSchema } from '@stardust/validation/global/schemas'

export class PlanetsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/planets')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private fetchAllPlanetsRoute(): void {
    this.router.get('/', this.authMiddleware.verifyAuthentication, async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabasePlanetsRepository(http.getSupabase())
      const controller = new FetchAllPlanetsController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerCreatePlanetStarRoute(): void {
    this.router.post(
      '/:planetId/stars',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          planetId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const planetsRepository = new SupabasePlanetsRepository(supabase)
        const starsRepository = new SupabaseStarsRepository(supabase)
        const controller = new CreatePlanetStarController(
          planetsRepository,
          starsRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerReorderPlanetStarsRoute(): void {
    this.router.put(
      '/:planetId/stars',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          planetId: idSchema,
        }),
      ),
      this.validationMiddleware.validate(
        'json',
        z.object({
          starIds: z.array(idSchema),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const planetsRepository = new SupabasePlanetsRepository(supabase)
        const starsRepository = new SupabaseStarsRepository(supabase)
        const controller = new ReorderPlanetStarsController(
          planetsRepository,
          starsRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeletePlanetStarRoute(): void {
    this.router.delete(
      '/:planetId/stars/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          planetId: idSchema,
          starId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const planetsRepository = new SupabasePlanetsRepository(supabase)
        const starsRepository = new SupabaseStarsRepository(supabase)
        const controller = new DeletePlanetStarController(
          planetsRepository,
          starsRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchAllPlanetsRoute()
    this.registerCreatePlanetStarRoute()
    this.registerDeletePlanetStarRoute()
    this.registerReorderPlanetStarsRoute()
    return this.router
  }
}
