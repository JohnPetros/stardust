import { Hono } from 'hono'
import { z } from 'zod'

import {
  challengeCodeExecutionSchema,
  challengeCodeExecutionsListQuerySchema,
} from '@stardust/validation/challenging/schemas'
import { idSchema } from '@stardust/validation/global/schemas'
import { DeleguaProvedorLsp } from '@stardust/lsp'

import { DrizzleChallengeCodeExecutionsRepository } from '@/database/drizzle/repositories'
import { DrizzleChallengesRepository } from '@/database/drizzle/repositories'
import {
  CountChallengeCodeExecutionErrorsController,
  ListChallengeCodeExecutionsController,
  RunChallengeCodeController,
} from '@/rest/controllers/challenging/challenges'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class ChallengeCodeExecutionsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/challenges')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerRunChallengeCodeRoute(): void {
    this.router.post(
      '/:challengeId/code-executions',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', challengeCodeExecutionSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const challengesRepository = new DrizzleChallengesRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const executionsRepository = new DrizzleChallengeCodeExecutionsRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const lspProvider = new DeleguaProvedorLsp()
        const controller = new RunChallengeCodeController(
          challengesRepository,
          executionsRepository,
          lspProvider,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchChallengeCodeExecutionsRoute(): void {
    this.router.get(
      '/:challengeId/code-executions',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('query', challengeCodeExecutionsListQuerySchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new DrizzleChallengeCodeExecutionsRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const controller = new ListChallengeCodeExecutionsController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchChallengeCodeExecutionErrorsCountRoute(): void {
    this.router.get(
      '/:challengeId/code-executions/errors-count',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new DrizzleChallengeCodeExecutionsRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const controller = new CountChallengeCodeExecutionErrorsController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerRunChallengeCodeRoute()
    this.registerFetchChallengeCodeExecutionsRoute()
    this.registerFetchChallengeCodeExecutionErrorsCountRoute()
    return this.router
  }
}
