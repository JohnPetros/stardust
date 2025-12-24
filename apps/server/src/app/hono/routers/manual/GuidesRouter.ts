import { Hono } from 'hono'
import { z } from 'zod'
import { idSchema } from '@stardust/validation/global/schemas'
import { guideCategorySchema, guideSchema } from '@stardust/validation/manual/schemas'
import {
  FetchAllGuidesController,
  CreateGuideController,
  UpdateGuideController,
  DeleteGuideController,
  ReorderGuidesController,
} from '@/rest/controllers/manual'
import { SupabaseGuidesRepository } from '@/database'
import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class GuidesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/guides')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerFetchAllGuidesRoute(): void {
    this.router.get(
      '/',
      this.validationMiddleware.validate(
        'query',
        z.object({
          category: guideCategorySchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseGuidesRepository(http.getSupabase())
        const controller = new FetchAllGuidesController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerCreateGuideRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('json', guideSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseGuidesRepository(http.getSupabase())
        const controller = new CreateGuideController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerUpdateGuideRoute(): void {
    this.router.put(
      '/:guideId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          guideId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', guideSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseGuidesRepository(http.getSupabase())
        const controller = new UpdateGuideController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteGuideRoute(): void {
    this.router.delete(
      '/:guideId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          guideId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseGuidesRepository(http.getSupabase())
        const controller = new DeleteGuideController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerReorderGuidesRoute(): void {
    this.router.post(
      '/reorder',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'json',
        z.object({
          guideIds: z.array(idSchema),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseGuidesRepository(http.getSupabase())
        const controller = new ReorderGuidesController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchAllGuidesRoute()
    this.registerCreateGuideRoute()
    this.registerUpdateGuideRoute()
    this.registerDeleteGuideRoute()
    this.registerReorderGuidesRoute()
    return this.router
  }
}
