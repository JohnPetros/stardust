import { Hono } from 'hono'

import { explainCodeRequestSchema } from '@stardust/validation/lesson/schemas'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { RedisCacheProvider } from '@/provision/cache/RedisCacheProvider'
import {
  ExplainCodeController,
  FetchRemainingCodeExplanationUsesController,
} from '@/rest/controllers/lesson'
import { MastraExplainCodeWorkflow } from '@/ai/mastra/workflows'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class CodeExplanationRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/code-explanation')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private fetchRemainingUsesRoute(): void {
    this.router.get(
      '/remaining-uses',
      this.authMiddleware.verifyAuthentication,
      async (context) => {
        const http = new HonoHttp(context)
        const cacheProvider = new RedisCacheProvider()
        const controller = new FetchRemainingCodeExplanationUsesController(cacheProvider)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private explainCodeRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('json', explainCodeRequestSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const cacheProvider = new RedisCacheProvider()
        const explainCodeWorkflow = new MastraExplainCodeWorkflow()
        const controller = new ExplainCodeController(cacheProvider, explainCodeWorkflow)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchRemainingUsesRoute()
    this.explainCodeRoute()
    return this.router
  }
}
