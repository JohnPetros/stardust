import { Hono } from 'hono'
import { z } from 'zod'

import { feedbackReportSchema } from '@stardust/validation/reporting/schemas'
import {
  DeleteFeedbackReportController,
  ListFeedbackReportsController,
  SendFeedbackReportController,
} from '@/rest/controllers/reporting'
import {
  DeleteFeedbackReportUseCase,
  ListFeedbackReportsUseCase,
  SendFeedbackReportUseCase,
} from '@stardust/core/reporting/use-cases'
import { SupabaseFeedbackReportsRepository } from '@/database/supabase/repositories/reporting'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import {
  AuthMiddleware,
  ProfileMiddleware,
  ValidationMiddleware,
} from '../../middlewares'
import {
  dateSchema,
  idSchema,
  itemsPerPageSchema,
  pageSchema,
} from '@stardust/validation/global/schemas'
import { feedbackReportIntentSchema } from '@stardust/validation/reporting/schemas'

export class FeedbackRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/feedback')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()

  private registerListFeedbackReportsRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate(
        'query',
        z.object({
          page: pageSchema.optional(),
          itemsPerPage: itemsPerPageSchema.optional(),
          authorName: z.string().optional(),
          intent: feedbackReportIntentSchema.optional(),
          startDate: dateSchema.optional(),
          endDate: dateSchema.optional(),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseFeedbackReportsRepository(http.getSupabase())
        const useCase = new ListFeedbackReportsUseCase(repository)
        const controller = new ListFeedbackReportsController(useCase)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerSendFeedbackRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('json', feedbackReportSchema),
      this.profileMiddleware.appendUserInfoToBody,
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseFeedbackReportsRepository(http.getSupabase())
        const broker = new InngestBroker()
        const useCase = new SendFeedbackReportUseCase(repository, broker)
        const controller = new SendFeedbackReportController(useCase)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteFeedbackRoute(): void {
    this.router.delete(
      '/:feedbackId',
      this.authMiddleware.verifyAuthentication,
      this.authMiddleware.verifyGodAccount,
      this.validationMiddleware.validate('param', z.object({ feedbackId: idSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseFeedbackReportsRepository(http.getSupabase())
        const useCase = new DeleteFeedbackReportUseCase(repository)
        const controller = new DeleteFeedbackReportController(useCase)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerListFeedbackReportsRoute()
    this.registerSendFeedbackRoute()
    this.registerDeleteFeedbackRoute()
    return this.router
  }
}
