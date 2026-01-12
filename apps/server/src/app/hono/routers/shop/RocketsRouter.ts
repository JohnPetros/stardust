import { Hono } from 'hono'
import { z } from 'zod'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import {
  FetchRocketsListController,
  CreateRocketController,
  UpdateRocketController,
  DeleteRocketController,
} from '@/rest/controllers/shop'
import { SupabaseRocketsRepository } from '@/database/supabase/repositories/shop'
import {
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
  idSchema,
  listingOrderSchema,
} from '@stardust/validation/global/schemas'
import { rocketSchema } from '@stardust/validation/shop/schemas'
import { ValidationMiddleware } from '../../middlewares'
import { AuthMiddleware } from '../../middlewares'

export class RocketsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/rockets')
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly authMiddleware = new AuthMiddleware()

  private fetchRocketsListRoute(): void {
    this.router.get(
      '/',
      this.validationMiddleware.validate(
        'query',
        z.object({
          search: stringSchema.default(''),
          priceOrder: listingOrderSchema,
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseRocketsRepository(http.getSupabase())
        const controller = new FetchRocketsListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private createRocketRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('json', rocketSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseRocketsRepository(http.getSupabase())
        const controller = new CreateRocketController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private updateRocketRoute(): void {
    this.router.put(
      '/:rocketId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'param',
        z.object({
          rocketId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', rocketSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseRocketsRepository(http.getSupabase())
        const controller = new UpdateRocketController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private deleteRocketRoute(): void {
    this.router.delete(
      '/:rocketId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'param',
        z.object({
          rocketId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseRocketsRepository(http.getSupabase())
        const controller = new DeleteRocketController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchRocketsListRoute()
    this.createRocketRoute()
    this.updateRocketRoute()
    this.deleteRocketRoute()
    return this.router
  }
}
