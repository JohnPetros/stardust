import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import { Event } from '#global/domain/abstracts/Event'
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
import type { FileStorageProvider } from '#storage/interfaces/FileStorageProvider'
import { FileStorageFolderPath } from '#storage/domain/structures/FileStorageFolderPath'
import { Logical } from '#global/domain/structures/Logical'
import {
  FeedbackAdminMessageSentEvent,
  FeedbackMessageCreatedEvent,
  FeedbackReportClosedEvent,
  FeedbackUserMessageCreatedEvent,
} from '../domain/events'

export class SendFeedbackMessageUseCase
  implements
    UseCase<SendFeedbackMessageUseCaseRequest, Promise<SendFeedbackMessageResponse>>
{
  constructor(
    private readonly reports: FeedbackReportsRepository,
    private readonly messages: FeedbackMessagesRepository,
    private readonly broker: Broker,
    private readonly storage?: FileStorageProvider,
  ) {}

  async execute(request: SendFeedbackMessageUseCaseRequest) {
    const report = await this.reports.findById(Id.create(request.feedbackReportId))
    if (!report) throw new FeedbackReportNotFoundError()
    const existing = await this.messages.findById(Id.create(request.messageId))
    if (existing) {
      if (
        existing.reportId.value !== report.id.value ||
        existing.content.value !== request.content.trim() ||
        existing.authorId.value !== request.actor.accountId ||
        existing.authorRole.value !== request.actor.role
      ) {
        throw new ConflictError('messageId já foi usado com outro conteúdo')
      }
      return { report, message: existing, isDuplicate: Logical.create(true) }
    }
    if (
      request.actor.role !== 'admin' &&
      report.author.id.value !== request.actor.accountId
    ) {
      throw new NotAllowedError('A conta não pode responder a este relatório')
    }
    if (report.status.isClosed.isTrue)
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
    const message = FeedbackMessage.create({
      id: request.messageId,
      reportId: report.id.value,
      authorRole: request.actor.role,
      authorId: request.actor.accountId,
      content: request.content,
      attachments: request.attachments,
    })
    if (this.storage) {
      const folder = FileStorageFolderPath.createAsFeedbackMessages(
        report.id.value,
        message.id.value,
      )
      for (const attachment of request.attachments) {
        const storageKeyPrefix = `${folder.value}/`
        if (
          !attachment.storageKey.startsWith(storageKeyPrefix) ||
          attachment.storageKey.includes('/', storageKeyPrefix.length)
        ) {
          throw new ConflictError('Anexo fora da pasta do relatório')
        }
        const storageFileName = attachment.storageKey.slice(storageKeyPrefix.length)
        if (!/^[0-9a-f-]{36}\.(png|jpg|jpeg)$/i.test(storageFileName)) {
          throw new ConflictError('Chave de storage do anexo inválida')
        }
        const metadata = await this.storage.getFileMetadata(
          folder,
          Text.create(storageFileName),
        )
        if (
          !metadata ||
          metadata.mimeType !== attachment.mimeType ||
          metadata.size !== attachment.size
        ) {
          throw new ConflictError(
            'Metadados do anexo não correspondem ao objeto armazenado',
          )
        }
      }
    }
    const hadAdminReply = report.adminMessageCount > 0
    report.registerMessage(request.actor.role, message.createdAt)
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
    const persistedMessage = await this.messages.add(message)
    await this.messages.addAttachments(message)
    await this.reports.save(report)

    const result = {
      report,
      message: persistedMessage,
      isDuplicate: Logical.create(false),
    }

    if (request.actor.role === 'admin') {
      await this.publish(
        new FeedbackMessageCreatedEvent({
          reportId: report.id.value,
          messageId: message.id.value,
          recipientEmail: recipientEmail?.value,
          reply: message.content.value,
          preview: message.content.value.slice(0, 160),
          conversationUrl: `/reporting/feedback/${report.id.value}`,
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
          conversationUrl: `/reporting/feedback/${report.id.value}`,
        }),
        `feedback-user-message:${message.id.value}`,
      )
    }
    return result
  }

  private async publish(event: Event, eventKey: string): Promise<void> {
    await this.broker.publish(event, Text.create(eventKey))
  }
}
