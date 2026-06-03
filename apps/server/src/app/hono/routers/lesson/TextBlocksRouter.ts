import { Hono } from 'hono'
import z from 'zod'

import { textBlockSchema } from '@stardust/validation/lesson/schemas'
import { requestTextBlockAudioGenerationSchema } from '@stardust/validation/lesson/schemas'
import { idSchema } from '@stardust/validation/global/schemas'

import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { SupabaseTextBlocksRepository } from '@/database/supabase/repositories/lesson'
import {
  CancelTextBlockAudioGenerationController,
  CancelTextBlocksAudioGenerationInBatchController,
  FetchTextBlocksController,
  TriggerTextBlockAudioGenerationController,
  TriggerTextBlocksAudioGenerationInBatchController,
  UpdateTextBlocksController,
} from '@/rest/controllers/lesson'
import { AuthMiddleware, SpaceMiddleware, ValidationMiddleware } from '../../middlewares'
import { InngestBroker } from '@/queue/inngest/InngestBroker'

export class TextBlocksRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/text-blocks')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly spaceMiddleware = new SpaceMiddleware()

  private fetchTextBlocksRoute(): void {
    this.router.get(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseTextBlocksRepository(http.getSupabase())
        const controller = new FetchTextBlocksController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private updateTextBlocksRoute(): void {
    this.router.put(
      '/star/:starId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.validationMiddleware.validate(
        'json',
        z.object({ textBlocks: z.array(textBlockSchema) }),
      ),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseTextBlocksRepository(http.getSupabase())
        const controller = new UpdateTextBlocksController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private requestTextBlockAudioRoute(): void {
    this.router.post(
      '/star/:starId/audio',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.validationMiddleware.validate('json', requestTextBlockAudioGenerationSchema),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseTextBlocksRepository(http.getSupabase())
        const broker = new InngestBroker()
        const controller = new TriggerTextBlockAudioGenerationController(
          repository,
          broker,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private requestTextBlocksAudioGenerationInBatchRoute(): void {
    this.router.post(
      '/star/:starId/audio/batch',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseTextBlocksRepository(http.getSupabase())
        const broker = new InngestBroker()
        const controller = new TriggerTextBlocksAudioGenerationInBatchController(
          repository,
          broker,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private cancelTextBlockAudioGenerationRoute(): void {
    this.router.delete(
      '/star/:starId/audio',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.validationMiddleware.validate(
        'json',
        z.object({
          blockIndex: z
            .number()
            .int('Índice do bloco inválido')
            .min(0, 'Índice do bloco inválido'),
        }),
      ),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        console.log('requestTextBlocksAudioGenerationInBatchRoute')
        const http = new HonoHttp(context)
        const repository = new SupabaseTextBlocksRepository(http.getSupabase())
        const broker = new InngestBroker()
        const controller = new CancelTextBlockAudioGenerationController(
          repository,
          broker,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private cancelTextBlocksAudioGenerationInBatchRoute(): void {
    this.router.delete(
      '/star/:starId/audio/batch',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('param', z.object({ starId: idSchema })),
      this.spaceMiddleware.verifyStarExists,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseTextBlocksRepository(http.getSupabase())
        const broker = new InngestBroker()
        const controller = new CancelTextBlocksAudioGenerationInBatchController(
          repository,
          broker,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchTextBlocksRoute()
    this.updateTextBlocksRoute()
    this.requestTextBlockAudioRoute()
    this.requestTextBlocksAudioGenerationInBatchRoute()
    this.cancelTextBlockAudioGenerationRoute()
    this.cancelTextBlocksAudioGenerationInBatchRoute()
    return this.router
  }
}
