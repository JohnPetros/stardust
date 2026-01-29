import { Hono } from 'hono'

import { feedbackReportSchema } from '@stardust/validation/reporting/schemas'
import { SendFeedbackReportController } from '@/rest/controllers/reporting'
import { SendFeedbackReportUseCase } from '@stardust/core/reporting/use-cases'
import { SupabaseFeedbackReportsRepository } from '@/database/supabase/repositories/reporting'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import {
  AuthMiddleware,
  ProfileMiddleware,
  ValidationMiddleware,
} from '../../middlewares'

export class FeedbackRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/feedback')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()

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

  registerRoutes(): Hono {
    this.registerSendFeedbackRoute()
    return this.router
  }
}
