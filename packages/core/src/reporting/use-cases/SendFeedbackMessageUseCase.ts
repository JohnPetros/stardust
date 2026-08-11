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

export class SendFeedbackMessageUseCase
  implements
    UseCase<SendFeedbackMessageUseCaseRequest, Promise<SendFeedbackMessageResponse>>
{
  constructor(
    private readonly reports: FeedbackReportsRepository,
    private readonly messages: FeedbackMessagesRepository,
    private readonly broker: Broker,
    private readonly conversationBaseUrl?: string,
  ) {}

  async execute(request: SendFeedbackMessageUseCaseRequest) {
    const report = await this.reports.findById(Id.create(request.feedbackReportId))
    if (!report) throw new FeedbackReportNotFoundError()
    const existing = await this.messages.findById(Id.create(request.messageId))
    const isDuplicate = Boolean(existing)
    if (existing) {
      if (
        existing.reportId.value !== report.id.value ||
        existing.content.value !== request.content.trim() ||
        existing.authorId.value !== request.actor.accountId ||
        existing.authorRole.value !== request.actor.role
      ) {
        throw new ConflictError('messageId já foi usado com outro conteúdo')
      }
      if (JSON.stringify(existing.attachments) !== JSON.stringify(request.attachments)) {
        throw new ConflictError('messageId já foi usado com outros anexos')
      }
    }
    if (
      request.actor.role !== 'admin' &&
      report.author.id.value !== request.actor.accountId
    ) {
      throw new NotAllowedError('A conta não pode responder a este relatório')
    }
    if (!isDuplicate && report.status.isClosed.isTrue)
      throw new ConflictError('Relatório de feedback fechado')
    const recipientEmail =
      request.actor.role === 'admin'
        ? await this.reports.findAuthorEmail(report.id)
        : undefined
    if (request.actor.role === 'admin') {
      if (!recipientEmail)
        throw new AppError('O autor do relatório não possui e-mail válido')
      Email.create(recipientEmail.value)
    }
    const message =
      existing ??
      FeedbackMessage.create({
        id: request.messageId,
        reportId: report.id.value,
        authorRole: request.actor.role,
        authorId: request.actor.accountId,
        content: request.content,
        attachments: request.attachments,
      })
    for (const attachment of message.attachments) {
      FeedbackImage.createAsOriginal(
        attachment.originalName,
        attachment.mimeType,
        attachment.size,
      )
    }
    const hadAdminReply =
      report.adminMessageCount > 0 || message.authorRole.value === 'admin'
    if (!isDuplicate || message.createdAt > report.lastActivityAt) {
      report.registerMessage(request.actor.role, message.createdAt)
    }
    if (request.actor.role !== 'admin' && request.targetStatus) {
      throw new NotAllowedError('Somente administradores podem alterar o status')
    }
    const targetStatus = request.targetStatus
      ? FeedbackReportStatus.create(request.targetStatus)
      : undefined
    if (targetStatus?.isClosed.isTrue) {
      if (!hadAdminReply)
        throw new ConflictError('A primeira resposta não pode fechar o relatório')
      report.close()
    }
    const persistedMessage = isDuplicate ? message : await this.messages.add(message)
    await this.messages.addAttachments(message)
    await this.reports.save(report)

    const result = {
      report,
      message: persistedMessage,
      isDuplicate: Logical.create(isDuplicate),
    }

    if (request.actor.role === 'admin') {
      await this.publish(
        new FeedbackMessageCreatedEvent({
          reportId: report.id.value,
          messageId: message.id.value,
          recipientEmail: recipientEmail?.value,
          reply: message.content.value,
          preview: message.content.value.slice(0, 160),
          conversationUrl: this.conversationUrl(report.id.value),
          isClosed: result.report.status.isClosed.isTrue,
          idempotencyKey: `feedback-message:${message.id.value}`,
        }),
        `feedback-message:${message.id.value}`,
      )
      await this.publish(
        new FeedbackAdminMessageSentEvent({
          reportId: report.id.value,
          messageId: message.id.value,
        }),
        `feedback-admin-message-sent:${message.id.value}`,
      )
      if (result.report.status.isClosed.isTrue) {
        await this.publish(
          new FeedbackReportClosedEvent({
            reportId: report.id.value,
            messageId: message.id.value,
          }),
          `feedback-report-closed:${report.id.value}:${message.id.value}`,
        )
      }
    } else {
      await this.publish(
        new FeedbackUserMessageCreatedEvent({
          reportId: report.id.value,
          messageId: message.id.value,
          userName: report.author.dto.entity?.name,
          preview: message.content.value.slice(0, 160),
          hasAttachments: request.attachments.length > 0,
          conversationUrl: this.conversationUrl(report.id.value),
        }),
        `feedback-user-message:${message.id.value}`,
      )
    }
    return result
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
}
