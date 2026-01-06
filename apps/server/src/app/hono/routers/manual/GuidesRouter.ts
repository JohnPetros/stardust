import { Hono } from 'hono'
import { z } from 'zod'
import { idSchema } from '@stardust/validation/global/schemas'
import { guideCategorySchema } from '@stardust/validation/manual/schemas'
import {
  FetchAllGuidesController,
  FetchGuideController,
  CreateGuideController,
  DeleteGuideController,
  ReorderGuidesController,
  EditGuideTitleController,
  EditGuideContentController,
} from '@/rest/controllers/manual'
import { SupabaseGuidesRepository } from '@/database'
import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { InngestBroker } from '@/queue/inngest/InngestBroker'

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

  private registerFetchGuideRoute(): void {
    this.router.get(
      '/:guideId',
      this.validationMiddleware.validate(
        'param',
        z.object({
          guideId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseGuidesRepository(http.getSupabase())
        const controller = new FetchGuideController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerCreateGuideRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'json',
        z.object({
          guideTitle: z.string().min(1),
          guideCategory: guideCategorySchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseGuidesRepository(http.getSupabase())
        const controller = new CreateGuideController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteGuideRoute(): void {
    this.router.delete(
      '/:guideId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
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
      this.authMiddleware.verifyGodAccount,
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

  private registerEditGuideTitleRoute(): void {
    this.router.patch(
      '/:guideId/title',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'param',
        z.object({
          guideId: idSchema,
        }),
      ),
      this.validationMiddleware.validate(
        'json',
        z.object({
          guideTitle: z.string().min(1),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseGuidesRepository(http.getSupabase())
        const controller = new EditGuideTitleController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerEditGuideContentRoute(): void {
    this.router.patch(
      '/:guideId/content',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'param',
        z.object({
          guideId: idSchema,
        }),
      ),
      this.validationMiddleware.validate(
        'json',
        z.object({
          guideContent: z.string(),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseGuidesRepository(http.getSupabase())
        const broker = new InngestBroker()
        const controller = new EditGuideContentController(repository, broker)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchAllGuidesRoute()
    this.registerFetchGuideRoute()
    this.registerCreateGuideRoute()
    this.registerDeleteGuideRoute()
    this.registerReorderGuidesRoute()
    this.registerEditGuideTitleRoute()
    this.registerEditGuideContentRoute()
    return this.router
  }
}
