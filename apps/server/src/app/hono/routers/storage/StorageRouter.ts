import { Hono } from 'hono'
import { z } from 'zod'

import { storageFolderSchema } from '@stardust/validation/storage/schemas'
import {
  itemsPerPageSchema,
  pageSchema,
  searchSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'

import {
  FetchImagesListController,
  RemoveFileController,
  UploadFileController,
} from '@/rest/controllers/storage'
import { SupabaseStorageProvider } from '@/provision/storage'
import { HonoRouter } from '../../HonoRouter'
import { AuthMiddleware } from '../../middlewares'
import { ValidationMiddleware } from '../../middlewares'
import { HonoHttp } from '../../HonoHttp'

export class StorageRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/storage')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerUploadFileRoute(): void {
    this.router.post(
      '/:folder',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({ folder: storageFolderSchema }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const storageProvider = new SupabaseStorageProvider()
        const controller = new UploadFileController(storageProvider)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerGetImagesRoute(): void {
    this.router.get(
      '/:folder/images',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'query',
        z.object({
          folder: storageFolderSchema,
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
          search: searchSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const storageProvider = new SupabaseStorageProvider()
        const controller = new FetchImagesListController(storageProvider)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerRemoveFileRoute(): void {
    this.router.delete(
      '/:folder/:fileName',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          fileName: stringSchema,
          folder: storageFolderSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const storageProvider = new SupabaseStorageProvider()
        const controller = new RemoveFileController(storageProvider)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerUploadFileRoute()
    this.registerRemoveFileRoute()
    this.registerGetImagesRoute()
    return this.router
  }
}
