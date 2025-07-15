import { Hono } from 'hono'
import { z } from 'zod'
import {
  idSchema,
  pageSchema,
  itemsPerPageSchema,
  titleSchema,
} from '@stardust/validation/global/schemas'
import { snippetSchema } from '@stardust/validation/playground/schemas'

import { SupabaseSnippetsRepository } from '@/database/supabase/repositories/playground'
import {
  CreateSnippetController,
  DeleteSnippetController,
  EditSnippetTitleController,
  FetchSnippetController,
  FetchSnippetsListController,
  UpdateSnippetController,
} from '@/rest/controllers/playground'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { HonoRouter } from '../../HonoRouter'

export class SnippetsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/snippets')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerFetchSnippetsListRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'query',
        z.object({
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSnippetsRepository(http.getSupabase())
        const controller = new FetchSnippetsListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchSnippetRoute(): void {
    this.router.get(
      '/:snippetId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          snippetId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSnippetsRepository(http.getSupabase())
        const controller = new FetchSnippetController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerCreateSnippetRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('json', snippetSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSnippetsRepository(http.getSupabase())
        const controller = new CreateSnippetController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerUpdateSnippetRoute(): void {
    this.router.put(
      '/:snippetId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          snippetId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', snippetSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSnippetsRepository(http.getSupabase())
        const controller = new UpdateSnippetController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerEditSnippetTitleRoute(): void {
    this.router.patch(
      '/:snippetId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          snippetId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', z.object({ title: titleSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSnippetsRepository(http.getSupabase())
        const controller = new EditSnippetTitleController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteSnippetRoute(): void {
    this.router.delete(
      '/:snippetId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          snippetId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSnippetsRepository(http.getSupabase())
        const controller = new DeleteSnippetController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchSnippetsListRoute()
    this.registerFetchSnippetRoute()
    this.registerCreateSnippetRoute()
    this.registerUpdateSnippetRoute()
    this.registerEditSnippetTitleRoute()
    this.registerDeleteSnippetRoute()
    return this.router
  }
}
