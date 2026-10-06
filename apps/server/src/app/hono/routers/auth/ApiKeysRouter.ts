import { Hono, type Context } from 'hono'
import { z } from 'zod'

import { idSchema, nameSchema } from '@stardust/validation/global/schemas'

import { DrizzleApiKeysRepository } from '@/database/drizzle/repositories'
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
        const repository = new DrizzleApiKeysRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
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
        const repository = new DrizzleApiKeysRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
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
      ...this.apiKeyIdMiddlewares(),
      this.validationMiddleware.validate('json', z.object({ name: nameSchema })),
      (context) => this.handleRenameApiKey(context),
    )
  }

  private registerRevokeApiKeyRoute(): void {
    this.router.delete('/:apiKeyId', ...this.apiKeyIdMiddlewares(), (context) =>
      this.handleRevokeApiKey(context),
    )
  }

  private apiKeyAccessMiddlewares() {
    return [
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.verifyUserEngineerInsignia,
    ] as const
  }

  private apiKeyIdMiddlewares() {
    return [
      ...this.apiKeyAccessMiddlewares(),
      this.validationMiddleware.validate('param', apiKeyIdParamsSchema),
    ] as const
  }

  private apiKeyRepository(http: HonoHttp<Context>): DrizzleApiKeysRepository {
    return new DrizzleApiKeysRepository(http.getDatabase(), http.getDatabaseAccess())
  }

  private async handleRenameApiKey(context: Context) {
    const http = new HonoHttp(context)
    const repository = this.apiKeyRepository(http)
    const controller = new RenameApiKeyController(repository)
    const response = await controller.handle(http)
    return http.sendResponse(response)
  }

  private async handleRevokeApiKey(context: Context) {
    const http = new HonoHttp(context)
    const repository = this.apiKeyRepository(http)
    const controller = new RevokeApiKeyController(repository)
    const response = await controller.handle(http)
    return http.sendResponse(response)
  }

  registerRoutes(): Hono {
    this.registerListApiKeysRoute()
    this.registerCreateApiKeyRoute()
    this.registerRenameApiKeyRoute()
    this.registerRevokeApiKeyRoute()
    return this.router
  }
}

const apiKeyIdParamsSchema = z.object({ apiKeyId: idSchema })
