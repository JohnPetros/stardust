import { Hono } from 'hono'
import { z } from 'zod'
import {
  feedbackAttachmentUploadSchema,
  feedbackMessageSchema,
  feedbackReadSchema,
  feedbackReportSchema,
  feedbackReportsQuerySchema,
  feedbackStatusSchema,
} from '@stardust/validation/reporting/schemas'
import { idSchema } from '@stardust/validation/global/schemas'
import { S3FileStorageProvider } from '@/provision/storage'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import {
  SupabaseFeedbackMessagesRepository,
  SupabaseFeedbackReportsRepository,
} from '@/database/supabase/repositories/reporting'
import { supabase } from '@/database/supabase/supabase'
import { ENV } from '@/constants'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import {
  AuthMiddleware,
  ProfileMiddleware,
  ValidationMiddleware,
} from '../../middlewares'
import {
  ChangeFeedbackReportStatusController,
  CreateFeedbackAttachmentUploadUrlController,
  GetFeedbackReportController,
  ListFeedbackReportsController,
  MarkFeedbackReportAsReadController,
  SendFeedbackMessageController,
  SendFeedbackReportController,
} from '@/rest/controllers/reporting'
import {
  ChangeFeedbackReportStatusUseCase,
  CreateFeedbackAttachmentUploadUrlUseCase,
  GetFeedbackReportUseCase,
  ListFeedbackReportsUseCase,
  MarkFeedbackReportAsReadUseCase,
  SendFeedbackMessageUseCase,
  SendFeedbackReportUseCase,
} from '@stardust/core/reporting/use-cases'

export class FeedbackRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/feedback')
  private readonly auth = new AuthMiddleware()
  private readonly validation = new ValidationMiddleware()
  private readonly profile = new ProfileMiddleware()
  private readonly params = z.object({ feedbackReportId: idSchema })
  private reports() {
    return new SupabaseFeedbackReportsRepository(supabase)
  }
  private messages() {
    return new SupabaseFeedbackMessagesRepository(supabase)
  }

  private registerList() {
    this.router.get(
      '/',
      this.auth.verifyAuthentication,
      this.auth.verifyGodAccount,
      this.validation.validate('query', feedbackReportsQuerySchema),
      async (context) => {
        const http = new HonoHttp(context)
        return http.sendResponse(
          await new ListFeedbackReportsController(
            new ListFeedbackReportsUseCase(this.reports()),
          ).handle(http),
        )
      },
    )
  }

  private registerCreate() {
    this.router.post(
      '/',
      this.auth.verifyAuthentication,
      this.validation.validate('json', feedbackReportSchema),
      this.profile.appendUserInfoToBody,
      async (context) => {
        const http = new HonoHttp(context)
        const controller = new SendFeedbackReportController(
          new SendFeedbackReportUseCase(this.reports(), new InngestBroker()),
        )
        return http.sendResponse(await controller.handle(http))
      },
    )
  }

  private registerDetail() {
    this.router.get(
      '/:feedbackReportId',
      this.auth.verifyAuthentication,
      this.auth.verifyGodAccount,
      this.validation.validate('param', this.params),
      async (context) => {
        const http = new HonoHttp(context)
        return http.sendResponse(
          await new GetFeedbackReportController(
            new GetFeedbackReportUseCase(this.reports(), this.messages()),
          ).handle(http),
        )
      },
    )
  }

  private registerRead() {
    this.router.put(
      '/:feedbackReportId/read',
      this.auth.verifyAuthentication,
      this.auth.verifyGodAccount,
      this.validation.validate('param', this.params),
      this.validation.validate('json', feedbackReadSchema),
      async (context) => {
        const http = new HonoHttp(context)
        return http.sendResponse(
          await new MarkFeedbackReportAsReadController(
            new MarkFeedbackReportAsReadUseCase(this.reports(), this.messages()),
          ).handle(http),
        )
      },
    )
  }

  private registerUpload() {
    this.router.post(
      '/:feedbackReportId/messages/:messageId/attachments/signed-upload-url',
      this.auth.verifyAuthentication,
      this.validation.validate(
        'param',
        z.object({ feedbackReportId: idSchema, messageId: idSchema }),
      ),
      this.validation.validate('json', feedbackAttachmentUploadSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const useCase = new CreateFeedbackAttachmentUploadUrlUseCase(
          this.reports(),
          new S3FileStorageProvider(),
        )
        return http.sendResponse(
          await new CreateFeedbackAttachmentUploadUrlController(useCase).handle(http),
        )
      },
    )
  }

  private registerMessage() {
    this.router.post(
      '/:feedbackReportId/messages',
      this.auth.verifyAuthentication,
      this.validation.validate('param', this.params),
      this.validation.validate('json', feedbackMessageSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const useCase = new SendFeedbackMessageUseCase(
          this.reports(),
          this.messages(),
          new InngestBroker(),
          new S3FileStorageProvider(),
          ENV.stardustWebUrl,
        )
        const response = await new SendFeedbackMessageController(useCase).handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerStatus() {
    this.router.patch(
      '/:feedbackReportId/status',
      this.auth.verifyAuthentication,
      this.auth.verifyGodAccount,
      this.validation.validate('param', this.params),
      this.validation.validate('json', feedbackStatusSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const useCase = new ChangeFeedbackReportStatusUseCase(
          this.reports(),
          new InngestBroker(),
        )
        return http.sendResponse(
          await new ChangeFeedbackReportStatusController(useCase).handle(http),
        )
      },
    )
  }

  registerRoutes(): Hono {
    this.registerList()
    this.registerCreate()
    this.registerDetail()
    this.registerRead()
    this.registerUpload()
    this.registerMessage()
    this.registerStatus()
    return this.router
  }
}
