import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import {
  idSchema,
  stringSchema,
  pageSchema,
  itemsPerPageSchema,
  booleanSchema,
} from '@stardust/validation'

import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware } from '../../middlewares'
import { HonoRouter } from '../../HonoRouter'
import { SupabaseSnippetsRepository } from '@/database/supabase/repositories/playground'
import {
  CreateSnippetController,
  DeleteSnippetController,
  EditSnippetController,
  FetchSnippetController,
  FetchSnippetsListController,
} from '@/rest/controllers/playground'

export class SnippetsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/snippets')
  private readonly authMiddleware = new AuthMiddleware()

  private registerFetchSnippetsListRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      zValidator(
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
      zValidator(
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
      zValidator(
        'json',
        z.object({
          title: stringSchema,
          code: stringSchema,
          isPublic: booleanSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSnippetsRepository(http.getSupabase())
        const controller = new CreateSnippetController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerEditSnippetRoute(): void {
    this.router.put(
      '/:snippetId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          snippetId: idSchema,
        }),
      ),
      zValidator('json', z.object({ title: stringSchema, code: stringSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseSnippetsRepository(http.getSupabase())
        const controller = new EditSnippetController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteSnippetRoute(): void {
    this.router.delete(
      '/:snippetId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
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
    this.registerEditSnippetRoute()
    this.registerDeleteSnippetRoute()
    return this.router
  }
}
