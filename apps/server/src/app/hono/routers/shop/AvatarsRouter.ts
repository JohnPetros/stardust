import { Hono } from 'hono'
import { z } from 'zod'

import {
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
  idSchema,
} from '@stardust/validation/global/schemas'
import { avatarSchema } from '@stardust/validation/shop/schemas'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import {
  FetchAvatarsListController,
  CreateAvatarController,
  UpdateAvatarController,
  DeleteAvatarController,
} from '@/rest/controllers/shop'
import { SupabaseAvatarsRepository } from '@/database/supabase/repositories/shop'
import { ValidationMiddleware } from '../../middlewares'
import { AuthMiddleware } from '../../middlewares'

export class AvatarsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/avatars')
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly authMiddleware = new AuthMiddleware()

  private fetchAvatarsListRoute(): void {
    this.router.get(
      '/',
      this.validationMiddleware.validate(
        'query',
        z.object({
          search: stringSchema.default(''),
          order: stringSchema,
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAvatarsRepository(http.getSupabase())
        const controller = new FetchAvatarsListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private createAvatarRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('json', avatarSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAvatarsRepository(http.getSupabase())
        const controller = new CreateAvatarController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private updateAvatarRoute(): void {
    this.router.put(
      '/:avatarId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'param',
        z.object({
          avatarId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', avatarSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAvatarsRepository(http.getSupabase())
        const controller = new UpdateAvatarController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private deleteAvatarRoute(): void {
    this.router.delete(
      '/:avatarId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'param',
        z.object({
          avatarId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAvatarsRepository(http.getSupabase())
        const controller = new DeleteAvatarController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchAvatarsListRoute()
    this.createAvatarRoute()
    this.updateAvatarRoute()
    this.deleteAvatarRoute()
    return this.router
  }
}
