import { Hono } from 'hono'
import { z } from 'zod'

import { idSchema, nameSchema } from '@stardust/validation/global/schemas'

import { SupabaseApiKeysRepository } from '@/database/supabase/repositories/auth'
import { NodeCryptoApiKeySecretProvider } from '@/provision/auth'
import {
  CreateApiKeyController,
  FetchApiKeysListController,
  RenameApiKeyController,
  RevokeApiKeyController,
} from '@/rest/controllers/auth'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware'
import { ProfileMiddleware } from '../../middlewares/ProfileMiddleware'
import { ValidationMiddleware } from '../../middlewares/ValidationMiddleware'
import { HonoRouter } from '../../HonoRouter'

export class ApiKeysRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/api-keys')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerListApiKeysRoute(): void {
    this.router.get(
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.verifyUserEngineerInsignia,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseApiKeysRepository(http.getSupabase())
        const controller = new FetchApiKeysListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerCreateApiKeyRoute(): void {
    this.router.post(
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.verifyUserEngineerInsignia,
      this.validationMiddleware.validate('json', z.object({ name: nameSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseApiKeysRepository(http.getSupabase())
        const secretProvider = new NodeCryptoApiKeySecretProvider()
        const controller = new CreateApiKeyController(repository, secretProvider)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerRenameApiKeyRoute(): void {
    this.router.put(
      '/:apiKeyId',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.verifyUserEngineerInsignia,
      this.validationMiddleware.validate(
        'param',
        z.object({
          apiKeyId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', z.object({ name: nameSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseApiKeysRepository(http.getSupabase())
        const controller = new RenameApiKeyController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerRevokeApiKeyRoute(): void {
    this.router.delete(
      '/:apiKeyId',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.verifyUserEngineerInsignia,
      this.validationMiddleware.validate(
        'param',
        z.object({
          apiKeyId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseApiKeysRepository(http.getSupabase())
        const controller = new RevokeApiKeyController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerListApiKeysRoute()
    this.registerCreateApiKeyRoute()
    this.registerRenameApiKeyRoute()
    this.registerRevokeApiKeyRoute()
    return this.router
  }
}
