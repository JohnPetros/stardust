import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
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

type FeedbackOperation = (
  reports: DrizzleFeedbackReportsRepository,
  messages: DrizzleFeedbackMessagesRepository,
  broker: Broker,
) => Promise<RestResponse>

export class FeedbackRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/feedback')
  private readonly auth = new AuthMiddleware()
  private readonly validation = new ValidationMiddleware()
  private readonly profile = new ProfileMiddleware()
  private readonly storage = new StorageMiddleware()
  private readonly params = z.object({ feedbackReportId: idSchema })
  private readonly adminAuthentication = [
    this.auth.verifyAuthentication,
    this.auth.verifyGodAccount,
  ] as const
  private readonly validateReportId = this.validation.validate('param', this.params)
  private readonly validateReport = this.validation.validate('json', feedbackReportSchema)
  private readonly validateRead = this.validation.validate('json', feedbackReadSchema)
  private readonly validateMessage = this.validation.validate(
    'json',
    feedbackMessageSchema,
  )
  private readonly validateStatus = this.validation.validate('json', feedbackStatusSchema)
  private readonly validateAttachment = this.validation.validate(
    'json',
    feedbackAttachmentUploadSchema,
  )
  private readonly validateMessageAttachment = this.validation.validate(
    'param',
    z.object({ feedbackReportId: idSchema, messageId: idSchema }),
  )

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
    handle: FeedbackOperation,
    access: DatabaseAccess = http.getDatabaseAccess(),
  ): Promise<RestResponse> {
    try {
      return await this.runTransaction(http, handle, access)
    } catch (error) {
      if (error instanceof RestResponse) return error
      throw error
    }
  }

  private runTransaction<C extends Context>(
    http: HonoHttp<C>,
    handle: FeedbackOperation,
    access: DatabaseAccess,
  ): Promise<RestResponse> {
    return new DrizzleUnitOfWork(http.getDatabase()).run(() =>
      this.runFeedbackOperation(http, handle, access),
    )
  }

  private async runFeedbackOperation<C extends Context>(
    http: HonoHttp<C>,
    handle: FeedbackOperation,
    access: DatabaseAccess,
  ): Promise<RestResponse> {
    const result = await this.invokeFeedbackOperation(http, handle, access)
    if (result.isFailure) throw result
    return result
  }

  private invokeFeedbackOperation<C extends Context>(
    http: HonoHttp<C>,
    handle: FeedbackOperation,
    access: DatabaseAccess,
  ): Promise<RestResponse> {
    return handle(
      this.reports(http, http.getDatabase(), access),
      this.messages(http, http.getDatabase(), access),
      new InngestBroker(),
    )
  }

  private registerList() {
    this.router.get(
      '/',
      ...this.adminAuthentication,
      this.validation.validate('query', feedbackReportsQuerySchema),
      (context) => this.handleList(new HonoHttp(context)),
    )
  }

  private registerCreate() {
    this.router.post(
      '/',
      this.auth.verifyAuthentication,
      this.validateReport,
      this.profile.appendUserInfoToBody,
      this.storage.verifyFeedbackInitialAttachment,
      (context) => this.handleCreate(new HonoHttp(context)),
    )
  }

  private registerUserAttachmentUpload() {
    this.router.post(
      '/attachments/signed-upload-url',
      this.auth.verifyAuthentication,
      this.validateAttachment,
      (context) => this.handleUserAttachmentUpload(new HonoHttp(context)),
    )
  }

  private registerUserList() {
    this.router.get(
      '/mine',
      this.auth.verifyAuthentication,
      this.validation.validate('query', userFeedbackReportsQuerySchema),
      (context) => this.handleUserList(new HonoHttp(context)),
    )
  }

  private registerUserUnreadCount() {
    this.router.get('/mine/unread-count', this.auth.verifyAuthentication, (context) =>
      this.handleUserUnreadCount(new HonoHttp(context)),
    )
  }

  private registerUserDetail() {
    this.router.get(
      '/mine/:feedbackReportId',
      this.auth.verifyAuthentication,
      this.validateReportId,
      (context) => this.handleUserDetail(new HonoHttp(context)),
    )
  }

  private registerUserRead() {
    this.router.put(
      '/mine/:feedbackReportId/read',
      this.auth.verifyAuthentication,
      this.validateReportId,
      this.validateRead,
      (context) => this.handleUserRead(new HonoHttp(context)),
    )
  }

  private registerDetail() {
    this.router.get(
      '/:feedbackReportId',
      ...this.adminAuthentication,
      this.validateReportId,
      (context) => this.handleDetail(new HonoHttp(context)),
    )
  }

  private registerRead() {
    this.router.put(
      '/:feedbackReportId/read',
      ...this.adminAuthentication,
      this.validateReportId,
      this.validateRead,
      (context) => this.handleRead(new HonoHttp(context)),
    )
  }

  private registerUpload() {
    this.router.post(
      '/:feedbackReportId/messages/:messageId/attachments/signed-upload-url',
      this.auth.verifyAuthentication,
      this.validateMessageAttachment,
      this.validateAttachment,
      (context) => this.handleUpload(new HonoHttp(context)),
    )
  }

  private registerMessage() {
    this.router.post(
      '/:feedbackReportId/messages',
      this.auth.verifyAuthentication,
      this.validateReportId,
      this.validateMessage,
      this.storage.verifyFeedbackMessageAttachments,
      (context) => this.handleMessage(new HonoHttp(context)),
    )
  }

  private registerStatus() {
    this.router.patch(
      '/:feedbackReportId/status',
      ...this.adminAuthentication,
      this.validateReportId,
      this.validateStatus,
      (context) => this.handleStatus(new HonoHttp(context)),
    )
  }

  private async handleList(http: HonoHttp<Context>) {
    return http.sendResponse(
      await new ListFeedbackReportsController(
        new ListFeedbackReportsUseCase(this.reports(http)),
      ).handle(http),
    )
  }

  private async handleCreate(http: HonoHttp<Context>) {
    return http.sendResponse(
      await this.transaction(http, async (reports, _messages, broker) => {
        return new SendFeedbackReportController(
          new SendFeedbackReportUseCase(
            new DrizzleUnitOfWork(http.getDatabase()),
            reports,
            broker,
          ),
        ).handle(http)
      }),
    )
  }

  private async handleUserAttachmentUpload(http: HonoHttp<Context>) {
    const useCase = new CreateFeedbackReportAttachmentUploadUrlUseCase(
      new S3FileStorageProvider(),
    )
    return http.sendResponse(
      await new CreateFeedbackReportAttachmentUploadUrlController(useCase).handle(http),
    )
  }

  private async handleUserList(http: HonoHttp<Context>) {
    return http.sendResponse(
      await new ListUserFeedbackReportsController(
        new ListUserFeedbackReportsUseCase(this.reports(http)),
      ).handle(http),
    )
  }

  private async handleUserUnreadCount(http: HonoHttp<Context>) {
    return http.sendResponse(
      await new CountUnreadFeedbackReportsController(
        new CountUnreadFeedbackReportsUseCase(this.reports(http)),
      ).handle(http),
    )
  }

  private async handleUserDetail(http: HonoHttp<Context>) {
    return http.sendResponse(
      await this.transaction(http, async (reports, messages) => {
        return new GetUserFeedbackReportController(
          new GetUserFeedbackReportUseCase(reports, messages),
        ).handle(http)
      }),
    )
  }

  private async handleUserRead(http: HonoHttp<Context>) {
    return http.sendResponse(
      await this.transaction(http, async (reports, messages) => {
        return new MarkUserFeedbackReportAsReadController(
          new MarkFeedbackReportAsReadUseCase(reports, messages),
        ).handle(http)
      }),
    )
  }

  private async handleDetail(http: HonoHttp<Context>) {
    return http.sendResponse(
      await this.transaction(http, async (reports, messages) => {
        return new GetFeedbackReportController(
          new GetFeedbackReportUseCase(reports, messages),
        ).handle(http)
      }),
    )
  }

  private async handleRead(http: HonoHttp<Context>) {
    return http.sendResponse(
      await this.transaction(http, async (reports, messages) => {
        return new MarkFeedbackReportAsReadController(
          new MarkFeedbackReportAsReadUseCase(reports, messages),
        ).handle(http)
      }),
    )
  }

  private async handleUpload(http: HonoHttp<Context>) {
    const access = await this.conversationAccess(http)
    const useCase = this.attachmentUpload(http, access)
    return http.sendResponse(
      await new CreateFeedbackAttachmentUploadUrlController(useCase).handle(http),
    )
  }

  private attachmentUpload(http: HonoHttp<Context>, access: DatabaseAccess) {
    return new CreateFeedbackAttachmentUploadUrlUseCase(
      this.reports(http, http.getDatabase(), access),
      new S3FileStorageProvider(),
    )
  }

  private async handleMessage(http: HonoHttp<Context>) {
    return http.sendResponse(
      await this.sendMessage(http, await this.conversationAccess(http)),
    )
  }

  private sendMessage(http: HonoHttp<Context>, access: DatabaseAccess) {
    return this.transaction(
      http,
      (reports, messages, broker) =>
        this.messageController(http, reports, messages, broker).handle(http),
      access,
    )
  }

  private messageController(
    http: HonoHttp<Context>,
    reports: DrizzleFeedbackReportsRepository,
    messages: DrizzleFeedbackMessagesRepository,
    broker: Broker,
  ) {
    return new SendFeedbackMessageController(
      this.messageUseCase(http, reports, messages, broker),
    )
  }

  private messageUseCase(
    http: HonoHttp<Context>,
    reports: DrizzleFeedbackReportsRepository,
    messages: DrizzleFeedbackMessagesRepository,
    broker: Broker,
  ) {
    return new SendFeedbackMessageUseCase(
      new DrizzleUnitOfWork(http.getDatabase()),
      reports,
      messages,
      broker,
      ENV.stardustWebUrl,
    )
  }

  private async handleStatus(http: HonoHttp<Context>) {
    return http.sendResponse(
      await this.transaction(http, async (reports, _messages, broker) => {
        return new ChangeFeedbackReportStatusController(
          new ChangeFeedbackReportStatusUseCase(
            new DrizzleUnitOfWork(http.getDatabase()),
            reports,
            broker,
          ),
        ).handle(http)
      }),
    )
  }

  private registerUserRoutes() {
    this.registerUserAttachmentUpload()
    this.registerUserList()
    this.registerUserUnreadCount()
    this.registerUserRead()
    this.registerUserDetail()
  }

  private registerAdminRoutes() {
    this.registerList()
    this.registerCreate()
    this.registerDetail()
    this.registerRead()
  }

  private registerConversationRoutes() {
    this.registerUpload()
    this.registerMessage()
    this.registerStatus()
  }

  registerRoutes(): Hono {
    this.registerUserRoutes()
    this.registerAdminRoutes()
    this.registerConversationRoutes()
    return this.router
  }
}
