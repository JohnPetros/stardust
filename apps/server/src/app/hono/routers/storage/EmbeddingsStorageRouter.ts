import { Hono } from 'hono'
import { z } from 'zod'

import { integerSchema, stringSchema } from '@stardust/validation/global/schemas'

import { SearchEmbeddingsController } from '@/rest/controllers/storage'
import {
  UpstashEmbeddingsStorageProvider,
  VercelEmbeddingsGeneratorProvider,
} from '@/provision/storage'
import { SearchEmbeddingsUseCase } from '@stardust/core/storage/use-cases'
import { HonoRouter } from '../../HonoRouter'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { HonoHttp } from '../../HonoHttp'

export class EmbeddingsStorageRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/embeddings')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerSearchEmbeddingsRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'query',
        z.object({
          query: stringSchema,
          namespace: stringSchema,
          topK: integerSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const generatorProvider = new VercelEmbeddingsGeneratorProvider()
        const storageProvider = new UpstashEmbeddingsStorageProvider()
        const useCase = new SearchEmbeddingsUseCase(generatorProvider, storageProvider)
        const controller = new SearchEmbeddingsController(useCase)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerSearchEmbeddingsRoute()
    return this.router
  }
}
