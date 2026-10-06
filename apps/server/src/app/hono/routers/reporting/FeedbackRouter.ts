import { Hono, type Context } from 'hono'
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
  DrizzleFeedbackMessagesRepository,
  DrizzleFeedbackReportsRepository,
} from '@/database/drizzle/repositories/reporting'
import type { Broker } from '@stardust/core/global/interfaces'
import { Id } from '@stardust/core/global/structures'
import { RestResponse } from '@stardust/core/global/responses'
import type { DrizzleDatabase } from '@/database/drizzle/DrizzleClient'
import type { DatabaseAccess } from '@/database/drizzle/DatabaseAccess'
import { ENV } from '@/constants'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import {
  AuthMiddleware,
  ProfileMiddleware,
  StorageMiddleware,
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
  private readonly storage = new StorageMiddleware()
  private readonly params = z.object({ feedbackReportId: idSchema })
  private reports<C extends Context>(
    http: HonoHttp<C>,
    database: DrizzleDatabase = http.getDatabase(),
    access: DatabaseAccess = http.getDatabaseAccess(),
  ) {
    return new DrizzleFeedbackReportsRepository(database, access)
  }
  private messages<C extends Context>(
    http: HonoHttp<C>,
    database: DrizzleDatabase = http.getDatabase(),
    access: DatabaseAccess = http.getDatabaseAccess(),
  ) {
    return new DrizzleFeedbackMessagesRepository(database, access)
  }
  private async conversationAccess<C extends Context>(
    http: HonoHttp<C>,
  ): Promise<DatabaseAccess> {
    const accountId = await http.getAccountId()
    return ENV.godAccountIds.includes(accountId)
      ? { kind: 'god', accountId: Id.create(accountId) }
      : http.getDatabaseAccess()
  }
  private async transaction<C extends Context>(
    http: HonoHttp<C>,
    handle: (
      reports: DrizzleFeedbackReportsRepository,
      messages: DrizzleFeedbackMessagesRepository,
      broker: Broker,
    ) => Promise<RestResponse>,
    access: DatabaseAccess = http.getDatabaseAccess(),
  ): Promise<RestResponse> {
    const events: Parameters<Broker['publish']>[] = []
    const broker: Broker = {
      publish: async (...event) => {
        events.push(event)
      },
    }
    let response: RestResponse
    try {
      response = await http.getDatabase().transaction(async (database) => {
        const result = await handle(
          this.reports(http, database, access),
          this.messages(http, database, access),
          broker,
        )
        if (result.isFailure) throw result
        return result
      })
    } catch (error) {
      if (error instanceof RestResponse) return error
      throw error
    }
    const publisher = new InngestBroker()
    for (const event of events) await publisher.publish(...event)
    return response
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
            new ListFeedbackReportsUseCase(this.reports(http)),
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
      this.storage.verifyFeedbackInitialAttachment,
      async (context) => {
        const http = new HonoHttp(context)
        return http.sendResponse(
          await this.transaction(http, async (reports, _messages, broker) => {
            return new SendFeedbackReportController(
              new SendFeedbackReportUseCase(reports, broker),
            ).handle(http)
          }),
        )
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
            new ListUserFeedbackReportsUseCase(this.reports(http)),
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
            new CountUnreadFeedbackReportsUseCase(this.reports(http)),
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
          await this.transaction(http, async (reports, messages) => {
            return new GetUserFeedbackReportController(
              new GetUserFeedbackReportUseCase(reports, messages),
            ).handle(http)
          }),
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
          await this.transaction(http, async (reports, messages) => {
            return new MarkUserFeedbackReportAsReadController(
              new MarkFeedbackReportAsReadUseCase(reports, messages),
            ).handle(http)
          }),
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
          await this.transaction(http, async (reports, messages) => {
            return new GetFeedbackReportController(
              new GetFeedbackReportUseCase(reports, messages),
            ).handle(http)
          }),
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
          await this.transaction(http, async (reports, messages) => {
            return new MarkFeedbackReportAsReadController(
              new MarkFeedbackReportAsReadUseCase(reports, messages),
            ).handle(http)
          }),
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
        const access = await this.conversationAccess(http)
        const useCase = new CreateFeedbackAttachmentUploadUrlUseCase(
          this.reports(http, http.getDatabase(), access),
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
      this.storage.verifyFeedbackMessageAttachments,
      async (context) => {
        const http = new HonoHttp(context)
        const access = await this.conversationAccess(http)
        return http.sendResponse(
          await this.transaction(
            http,
            async (reports, messages, broker) => {
              const useCase = new SendFeedbackMessageUseCase(
                reports,
                messages,
                broker,
                ENV.stardustWebUrl,
              )
              return new SendFeedbackMessageController(useCase).handle(http)
            },
            access,
          ),
        )
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
        return http.sendResponse(
          await this.transaction(http, async (reports, _messages, broker) => {
            return new ChangeFeedbackReportStatusController(
              new ChangeFeedbackReportStatusUseCase(reports, broker),
            ).handle(http)
          }),
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
