import { Hono } from 'hono'
import z from 'zod'

import { idSchema, nameSchema, stringSchema } from '@stardust/validation/global/schemas'
import { SupabasePlanetsRepository, SupabaseStarsRepository } from '@/database'
import {
  FetchAllPlanetsController,
  CreatePlanetController,
  UpdatePlanetController,
  CreatePlanetStarController,
  ReorderPlanetsController,
  ReorderPlanetStarsController,
  DeletePlanetStarController,
  DeletePlanetController,
} from '@/rest/controllers/space/planets'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { InngestEventBroker } from '@/queue/inngest/InngestEventBroker'

export class PlanetsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/planets')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerCreatePlanetRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'json',
        z.object({
          name: nameSchema,
          icon: stringSchema,
          image: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const planetsRepository = new SupabasePlanetsRepository(supabase)
        const controller = new CreatePlanetController(planetsRepository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerUpdatePlanetRoute(): void {
    this.router.put(
      '/:planetId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          planetId: idSchema,
        }),
      ),
      this.validationMiddleware.validate(
        'json',
        z
          .object({
            name: nameSchema.optional(),
            icon: stringSchema.optional(),
            image: stringSchema.optional(),
          })
          .refine(
            (body) =>
              typeof body.name !== 'undefined' ||
              typeof body.icon !== 'undefined' ||
              typeof body.image !== 'undefined',
            {
              message: 'At least one property must be provided',
            },
          ),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const planetsRepository = new SupabasePlanetsRepository(supabase)
        const controller = new UpdatePlanetController(planetsRepository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private fetchAllPlanetsRoute(): void {
    this.router.get('/', this.authMiddleware.verifyAuthentication, async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabasePlanetsRepository(http.getSupabase())
      const controller = new FetchAllPlanetsController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerDeletePlanetRoute(): void {
    this.router.delete(
      '/:planetId',
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
        const controller = new DeletePlanetController(planetsRepository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
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

  private registerReorderPlanetsRoute(): void {
    this.router.put(
      '/list/order',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'json',
        z.object({
          planetIds: z.array(stringSchema),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const repository = new SupabasePlanetsRepository(supabase)
        const broker = new InngestEventBroker()
        const controller = new ReorderPlanetsController(repository, broker)
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
        const repository = new SupabasePlanetsRepository(supabase)
        const broker = new InngestEventBroker()
        const starsRepository = new SupabaseStarsRepository(supabase)
        const controller = new ReorderPlanetStarsController(
          repository,
          starsRepository,
          broker,
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
    this.registerCreatePlanetRoute()
    this.fetchAllPlanetsRoute()
    this.registerUpdatePlanetRoute()
    this.registerDeletePlanetRoute()
    this.registerCreatePlanetStarRoute()
    this.registerDeletePlanetStarRoute()
    this.registerReorderPlanetStarsRoute()
    this.registerReorderPlanetsRoute()
    return this.router
  }
}
