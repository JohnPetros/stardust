import { Hono } from 'hono'
import { z } from 'zod'

import {
  idSchema,
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'
import { noteSchema } from '@stardust/validation/profile/schemas'

import { SupabaseNotesRepository } from '@/database/supabase/repositories/profile'
import {
  CreateNoteController,
  DeleteNoteController,
  ListNotesController,
  UpdateNoteController,
} from '@/rest/controllers/profile'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class NotesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/notes')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerListNotesRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'query',
        z.object({
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
          search: stringSchema.default(''),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseNotesRepository(http.getSupabase())
        const controller = new ListNotesController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerCreateNoteRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('json', noteSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseNotesRepository(http.getSupabase())
        const controller = new CreateNoteController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerUpdateNoteRoute(): void {
    this.router.put(
      '/:noteId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          noteId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', noteSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseNotesRepository(http.getSupabase())
        const controller = new UpdateNoteController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteNoteRoute(): void {
    this.router.delete(
      '/:noteId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          noteId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseNotesRepository(http.getSupabase())
        const controller = new DeleteNoteController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerListNotesRoute()
    this.registerCreateNoteRoute()
    this.registerUpdateNoteRoute()
    this.registerDeleteNoteRoute()
    return this.router
  }
}
