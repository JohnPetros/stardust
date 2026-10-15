import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import type { Event } from '#global/domain/abstracts/Event'
import { ConflictError } from '#global/domain/errors/ConflictError'
import { AppError } from '#global/domain/errors/AppError'
import { NotAllowedError } from '#global/domain/errors/NotAllowedError'
import { Email } from '#global/domain/structures/Email'
import { Id } from '#global/domain/structures/Id'
import { Text } from '#global/domain/structures/Text'
import { FeedbackMessage } from '../domain/entities/FeedbackMessage'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'
import { FeedbackReportNotFoundError } from '../domain/errors'
import type { FeedbackMessagesRepository, FeedbackReportsRepository } from '../interfaces'
import type {
  SendFeedbackMessageResponse,
  SendFeedbackMessageUseCaseRequest,
} from '../domain/types/FeedbackConversationRequests'
import { FeedbackReportStatus } from '../domain/structures/FeedbackReportStatus'
import { Logical } from '#global/domain/structures/Logical'
import {
  FeedbackAdminMessageSentEvent,
  FeedbackMessageCreatedEvent,
  FeedbackReportClosedEvent,
  FeedbackUserMessageCreatedEvent,
} from '../domain/events'
import { FeedbackImage } from '../domain/structures'

type Request = SendFeedbackMessageUseCaseRequest
type PreparedMessage = {
  report: FeedbackReport
  request: Request
  message: FeedbackMessage
  existing: FeedbackMessage | null
  recipientEmail?: Email
}

export class SendFeedbackMessageUseCase
  implements
    UseCase<SendFeedbackMessageUseCaseRequest, Promise<SendFeedbackMessageResponse>>
{
  constructor(
    private readonly database: Database,
    private readonly reports: FeedbackReportsRepository,
    private readonly messages: FeedbackMessagesRepository,
    private readonly broker: Broker,
    private readonly conversationBaseUrl?: string,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction(request: Request) {
    const report = await this.findReport(request)
    return this.sendMessage(report, request)
  }

  private async sendMessage(report: FeedbackReport, request: Request) {
    const prepared = await this.prepareMessage(report, request)
    const message = await this.persistMessage(prepared)
    await this.publishPrepared(prepared)
    return this.response(report, message, Boolean(prepared.existing))
  }

  private publishPrepared(prepared: PreparedMessage) {
    return this.publishMessageEvents(
      prepared.report,
      prepared.message,
      prepared.request,
      prepared.recipientEmail,
    )
  }

  private async prepareMessage(report: FeedbackReport, request: Request) {
    const existing = await this.findExisting(report, request)
    const recipientEmail = await this.findRecipientEmail(report, request)
    const message = this.applyMessage(report, request, existing)
    return { report, request, message, existing, recipientEmail }
  }

  private response(
    report: FeedbackReport,
    message: FeedbackMessage,
    isDuplicate: boolean,
  ) {
    return { report, message, isDuplicate: Logical.create(isDuplicate) }
  }

  private async findExisting(report: FeedbackReport, request: Request) {
    const existing = await this.messages.findById(Id.create(request.messageId))
    if (existing) this.validateDuplicate(existing, report, request)
    this.validateAccess(report, request, Boolean(existing))
    return existing
  }

  private async persistMessage({ report, message, existing }: PreparedMessage) {
    const persisted = existing ?? (await this.messages.add(message))
    await this.messages.addAttachments(message)
    await this.reports.save(report)
    return persisted
  }

  private async findReport(request: Request) {
    const report = await this.reports.findById(Id.create(request.feedbackReportId))
    if (!report) throw new FeedbackReportNotFoundError()
    return report
  }

  private validateDuplicate(
    existing: FeedbackMessage,
    report: FeedbackReport,
    request: Request,
  ) {
    this.validateDuplicateContent(existing, report, request)
    if (JSON.stringify(existing.attachments) !== JSON.stringify(request.attachments)) {
      throw new ConflictError('messageId já foi usado com outros anexos')
    }
  }

  private validateDuplicateContent(
    existing: FeedbackMessage,
    report: FeedbackReport,
    request: Request,
  ) {
    if (!this.sameContent(existing, report, request)) {
      throw new ConflictError('messageId já foi usado com outro conteúdo')
    }
  }

  private sameContent(
    existing: FeedbackMessage,
    report: FeedbackReport,
    request: Request,
  ) {
    return this.sameBody(existing, report, request) && this.sameAuthor(existing, request)
  }

  private sameBody(existing: FeedbackMessage, report: FeedbackReport, request: Request) {
    return (
      existing.reportId.value === report.id.value &&
      existing.content.value === request.content.trim()
    )
  }

  private sameAuthor(existing: FeedbackMessage, request: Request) {
    return (
      existing.authorId.value === request.actor.accountId &&
      existing.authorRole.value === request.actor.role
    )
  }

  private validateAccess(report: FeedbackReport, request: Request, isDuplicate: boolean) {
    this.validateAuthor(report, request)
    if (!isDuplicate && report.status.isClosed.isTrue) {
      throw new ConflictError('Relatório de feedback fechado')
    }
  }

  private validateAuthor(report: FeedbackReport, request: Request) {
    if (
      request.actor.role !== 'admin' &&
      report.author.id.value !== request.actor.accountId
    ) {
      throw new NotAllowedError('A conta não pode responder a este relatório')
    }
  }

  private async findRecipientEmail(report: FeedbackReport, request: Request) {
    if (request.actor.role !== 'admin') return undefined
    const email = await this.reports.findAuthorEmail(report.id)
    if (!email) throw new AppError('O autor do relatório não possui e-mail válido')
    Email.create(email.value)
    return email
  }

  private createMessage(report: FeedbackReport, request: Request) {
    return FeedbackMessage.create({
      ...this.messageInput(request),
      ...this.messageAuthor(request),
      reportId: report.id.value,
    })
  }

  private applyStatus(
    report: FeedbackReport,
    message: FeedbackMessage,
    request: Request,
    isDuplicate: boolean,
  ) {
    this.validateAttachments(message)
    const hadAdminReply = this.hadAdminReply(report, message)
    this.registerMessage(report, message, request, isDuplicate)
    this.applyTargetStatus(report, request, hadAdminReply)
  }

  private hadAdminReply(report: FeedbackReport, message: FeedbackMessage) {
    return report.adminMessageCount > 0 || message.authorRole.value === 'admin'
  }

  private registerMessage(
    report: FeedbackReport,
    message: FeedbackMessage,
    request: Request,
    isDuplicate: boolean,
  ) {
    if (!isDuplicate || message.createdAt > report.lastActivityAt) {
      report.registerMessage(request.actor.role, message.createdAt)
    }
  }

  private validateAttachments(message: FeedbackMessage) {
    for (const attachment of message.attachments) {
      FeedbackImage.createAsOriginal(
        attachment.originalName,
        attachment.mimeType,
        attachment.size,
      )
    }
  }

  private applyTargetStatus(
    report: FeedbackReport,
    request: Request,
    hadAdminReply: boolean,
  ) {
    const targetStatus = this.targetStatus(request)
    if (!targetStatus?.isClosed.isTrue) return
    if (!hadAdminReply)
      throw new ConflictError('A primeira resposta não pode fechar o relatório')
    report.close()
  }

  private targetStatus(request: Request) {
    if (request.actor.role !== 'admin' && request.targetStatus) {
      throw new NotAllowedError('Somente administradores podem alterar o status')
    }
    return request.targetStatus
      ? FeedbackReportStatus.create(request.targetStatus)
      : undefined
  }

  private async publishMessageEvents(
    report: FeedbackReport,
    message: FeedbackMessage,
    request: Request,
    recipientEmail?: Email,
  ) {
    if (request.actor.role === 'admin') {
      await this.publishAdminEvents(report, message, recipientEmail)
      return
    }
    await this.publishUserMessage(report, message, request)
  }

  private publishUserMessage(
    report: FeedbackReport,
    message: FeedbackMessage,
    request: Request,
  ) {
    const event = new FeedbackUserMessageCreatedEvent(
      this.userPayload(report, message, request),
    )
    return this.publish(event, `feedback-user-message:${message.id.value}`)
  }

  private userPayload(
    report: FeedbackReport,
    message: FeedbackMessage,
    request: Request,
  ) {
    return {
      ...this.messageIdentity(report, message),
      ...this.preview(report, message),
      ...this.userMetadata(report, request),
    }
  }

  private userMetadata(report: FeedbackReport, request: Request) {
    return {
      userName: report.author.dto.entity?.name,
      hasAttachments: request.attachments.length > 0,
    }
  }

  private async publishAdminEvents(
    report: FeedbackReport,
    message: FeedbackMessage,
    recipientEmail?: Email,
  ) {
    await this.publishReply(report, message, recipientEmail)
    await this.publishAdminMessageSent(report, message)
    if (report.status.isClosed.isTrue) await this.publishClosed(report, message)
  }

  private publishAdminMessageSent(report: FeedbackReport, message: FeedbackMessage) {
    const event = new FeedbackAdminMessageSentEvent(this.messageIdentity(report, message))
    return this.publish(event, `feedback-admin-message-sent:${message.id.value}`)
  }

  private publishClosed(report: FeedbackReport, message: FeedbackMessage) {
    const event = new FeedbackReportClosedEvent(this.messageIdentity(report, message))
    return this.publish(
      event,
      `feedback-report-closed:${report.id.value}:${message.id.value}`,
    )
  }

  private publishReply(
    report: FeedbackReport,
    message: FeedbackMessage,
    recipientEmail?: Email,
  ) {
    const event = new FeedbackMessageCreatedEvent({
      ...this.replyPayload(report, message),
      recipientEmail: recipientEmail?.value,
    })
    return this.publish(event, `feedback-message:${message.id.value}`)
  }

  private replyPayload(report: FeedbackReport, message: FeedbackMessage) {
    return {
      ...this.messageIdentity(report, message),
      ...this.preview(report, message),
      ...this.replyMetadata(report, message),
    }
  }

  private messageIdentity(report: FeedbackReport, message: FeedbackMessage) {
    return { reportId: report.id.value, messageId: message.id.value }
  }

  private preview(report: FeedbackReport, message: FeedbackMessage) {
    return {
      preview: message.content.value.slice(0, 160),
      conversationUrl: this.conversationUrl(report.id.value),
    }
  }

  private async publish(event: Event, eventKey: string): Promise<void> {
    await this.broker.publish(event, Text.create(eventKey))
  }

  private conversationUrl(reportId: string): string {
    const path = `/feedback/${reportId}`
    return this.conversationBaseUrl
      ? new URL(path, this.conversationBaseUrl).toString()
      : path
  }
  private messageInput(request: Request) {
    return {
      id: request.messageId,
      content: request.content,
      attachments: request.attachments,
    }
  }

  private messageAuthor(request: Request) {
    return { authorRole: request.actor.role, authorId: request.actor.accountId }
  }

  private replyMetadata(report: FeedbackReport, message: FeedbackMessage) {
    return {
      reply: message.content.value,
      isClosed: report.status.isClosed.isTrue,
      idempotencyKey: `feedback-message:${message.id.value}`,
    }
  }
  private applyMessage(
    report: FeedbackReport,
    request: Request,
    existing: FeedbackMessage | null,
  ) {
    const message = existing ?? this.createMessage(report, request)
    this.applyStatus(report, message, request, Boolean(existing))
    return message
  }
}
