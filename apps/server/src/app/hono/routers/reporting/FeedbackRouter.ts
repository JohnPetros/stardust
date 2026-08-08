import { Hono } from 'hono'
import { z } from 'zod'
import {
  feedbackAttachmentUploadSchema,
  feedbackMessageSchema,
  feedbackReadSchema,
  feedbackReportSchema,
  feedbackReportsQuerySchema,
  userFeedbackReportsQuerySchema,
  feedbackStatusSchema,
} from '@stardust/validation/reporting/schemas'
import { idSchema } from '@stardust/validation/global/schemas'
import { S3FileStorageProvider } from '@/provision/storage'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import {
  SupabaseFeedbackMessagesRepository,
  SupabaseFeedbackReportsRepository,
} from '@/database/supabase/repositories/reporting'
import { supabase, supabaseAdmin } from '@/database/supabase/supabase'
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
  CountUnreadFeedbackReportsController,
  CreateFeedbackAttachmentUploadUrlController,
  CreateFeedbackReportAttachmentUploadUrlController,
  GetFeedbackReportController,
  GetUserFeedbackReportController,
  ListFeedbackReportsController,
  ListUserFeedbackReportsController,
  MarkFeedbackReportAsReadController,
  MarkUserFeedbackReportAsReadController,
  SendFeedbackMessageController,
  SendFeedbackReportController,
} from '@/rest/controllers/reporting'
import {
  ChangeFeedbackReportStatusUseCase,
  CountUnreadFeedbackReportsUseCase,
  CreateFeedbackAttachmentUploadUrlUseCase,
  CreateFeedbackReportAttachmentUploadUrlUseCase,
  GetFeedbackReportUseCase,
  GetUserFeedbackReportUseCase,
  ListFeedbackReportsUseCase,
  ListUserFeedbackReportsUseCase,
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
  private reports(client = supabase) {
    return new SupabaseFeedbackReportsRepository(client)
  }
  private messages(client = supabase) {
    return new SupabaseFeedbackMessagesRepository(client)
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
            new ListFeedbackReportsUseCase(this.reports(supabaseAdmin)),
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
          new SendFeedbackReportUseCase(
            this.reports(context.get('supabase')),
            new InngestBroker(),
            new S3FileStorageProvider(),
          ),
        )
        return http.sendResponse(await controller.handle(http))
      },
    )
  }

  private registerUserAttachmentUpload() {
    this.router.post(
      '/attachments/signed-upload-url',
      this.auth.verifyAuthentication,
      this.validation.validate('json', feedbackAttachmentUploadSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const useCase = new CreateFeedbackReportAttachmentUploadUrlUseCase(
          new S3FileStorageProvider(),
        )
        return http.sendResponse(
          await new CreateFeedbackReportAttachmentUploadUrlController(useCase).handle(
            http,
          ),
        )
      },
    )
  }

  private registerUserList() {
    this.router.get(
      '/mine',
      this.auth.verifyAuthentication,
      this.validation.validate('query', userFeedbackReportsQuerySchema),
      async (context) => {
        const http = new HonoHttp(context)
        return http.sendResponse(
          await new ListUserFeedbackReportsController(
            new ListUserFeedbackReportsUseCase(this.reports(context.get('supabase'))),
          ).handle(http),
        )
      },
    )
  }

  private registerUserUnreadCount() {
    this.router.get(
      '/mine/unread-count',
      this.auth.verifyAuthentication,
      async (context) => {
        const http = new HonoHttp(context)
        return http.sendResponse(
          await new CountUnreadFeedbackReportsController(
            new CountUnreadFeedbackReportsUseCase(this.reports(context.get('supabase'))),
          ).handle(http),
        )
      },
    )
  }

  private registerUserDetail() {
    this.router.get(
      '/mine/:feedbackReportId',
      this.auth.verifyAuthentication,
      this.validation.validate('param', this.params),
      async (context) => {
        const http = new HonoHttp(context)
        return http.sendResponse(
          await new GetUserFeedbackReportController(
            new GetUserFeedbackReportUseCase(
              this.reports(context.get('supabase')),
              this.messages(context.get('supabase')),
            ),
          ).handle(http),
        )
      },
    )
  }

  private registerUserRead() {
    this.router.put(
      '/mine/:feedbackReportId/read',
      this.auth.verifyAuthentication,
      this.validation.validate('param', this.params),
      this.validation.validate('json', feedbackReadSchema),
      async (context) => {
        const http = new HonoHttp(context)
        return http.sendResponse(
          await new MarkUserFeedbackReportAsReadController(
            new MarkFeedbackReportAsReadUseCase(
              this.reports(context.get('supabase')),
              this.messages(context.get('supabase')),
            ),
          ).handle(http),
        )
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
            new GetFeedbackReportUseCase(
              this.reports(supabaseAdmin),
              this.messages(supabaseAdmin),
            ),
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
            new MarkFeedbackReportAsReadUseCase(
              this.reports(supabaseAdmin),
              this.messages(supabaseAdmin),
            ),
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
          this.reports(context.get('supabase')),
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
          this.reports(context.get('supabase')),
          this.messages(context.get('supabase')),
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
          this.reports(supabaseAdmin),
          new InngestBroker(),
        )
        return http.sendResponse(
          await new ChangeFeedbackReportStatusController(useCase).handle(http),
        )
      },
    )
  }

  registerRoutes(): Hono {
    this.registerUserAttachmentUpload()
    this.registerUserList()
    this.registerUserUnreadCount()
    this.registerUserRead()
    this.registerUserDetail()
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
