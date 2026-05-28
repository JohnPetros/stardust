import { Hono } from 'hono'
import { z } from 'zod'

import { fileStorageFolderPathSchema } from '@stardust/validation/storage/schemas'
import {
  itemsPerPageSchema,
  pageSchema,
  searchSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'

import {
  FetchFilesListController,
  RemoveFileController,
} from '@/rest/controllers/storage'
import { SupabaseFileStorageProvider } from '@/provision/storage'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class FilesStorageRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/files')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerlistFilesRoute(): void {
    this.router.get(
      '/',
      this.validationMiddleware.validate(
        'query',
        z.object({
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
          search: searchSchema,
          folder: fileStorageFolderPathSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const storageProvider = new SupabaseFileStorageProvider(http.getSupabase())
        const controller = new FetchFilesListController(storageProvider)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerRemoveFileRoute(): void {
    this.router.delete(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'query',
        z.object({
          fileName: stringSchema,
          folder: fileStorageFolderPathSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const storageProvider = new SupabaseFileStorageProvider(http.getSupabase())
        const controller = new RemoveFileController(storageProvider)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerRemoveFileRoute()
    this.registerlistFilesRoute()
    return this.router
  }
}
