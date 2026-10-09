import type { DrizzleTransaction } from '../../DrizzleClient'
import { and, asc, eq, getTableColumns, sql, type SQL } from 'drizzle-orm'
import type { FeedbackMessage } from '@stardust/core/reporting/entities'
import type { FeedbackMessagesRepository } from '@stardust/core/reporting/interfaces'
import type { Id } from '@stardust/core/global/structures'
import { AuthError, ConflictError, NotFoundError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { feedbackMessageModel } from '../../models/reporting/feedback-message-model'
import { feedbackMessageAttachmentModel } from '../../models/reporting/feedback-message-attachment-model'
import { feedbackReportModel } from '../../models/reporting/feedback-report-model'
import { DrizzleFeedbackMessageMapper } from '../../mappers/reporting/DrizzleFeedbackMessageMapper'
import type { DrizzleFeedbackMessage } from '../../types/entities/reporting'

export class DrizzleFeedbackMessagesRepository
  extends DrizzleRepository
  implements FeedbackMessagesRepository
{
  private ownerCondition(): SQL | undefined {
    if (this.access.kind === 'public') throw new AuthError('Conta não autorizada')
    return this.access.kind === 'user'
      ? eq(feedbackReportModel.userId, this.access.accountId.value)
      : undefined
  }

  private authorizeMessage(message: FeedbackMessage): void {
    this.ownerCondition()
    if (this.access.kind === 'user')
      this.assertActor(message, this.access.accountId, 'user')
    if (this.access.kind === 'god')
      this.assertActor(message, this.access.accountId, 'admin')
  }

  private assertActor(
    message: FeedbackMessage,
    accountId: Id,
    role: FeedbackMessage['dto']['authorRole'],
  ): void {
    if (message.authorId.value !== accountId.value || message.authorRole.value !== role)
      throw new AuthError('Conta não autorizada')
  }

  private messageColumns() {
    return {
      ...getTableColumns(feedbackMessageModel),
      feedbackMessageAttachments: this.attachmentAggregate(),
    }
  }

  private attachmentAggregate() {
    const { id, messageId, storageKey, originalName, mimeType, size, position } =
      feedbackMessageAttachmentModel
    return sql<
      DrizzleFeedbackMessage['feedbackMessageAttachments']
    >`coalesce((select json_agg(json_build_object('id', ${id}, 'messageId', ${messageId}, 'storageKey', ${storageKey}, 'originalName', ${originalName}, 'mimeType', ${mimeType}, 'size', ${size}, 'position', ${position}) order by ${position}) from ${feedbackMessageAttachmentModel} where ${messageId} = ${feedbackMessageModel.id}), '[]'::json)`
  }

  private query() {
    return this.database
      .select(this.messageColumns())
      .from(feedbackMessageModel)
      .innerJoin(
        feedbackReportModel,
        eq(feedbackReportModel.id, feedbackMessageModel.reportId),
      )
  }

  async findById(messageId: Id): Promise<FeedbackMessage | null> {
    const owner = this.ownerCondition()
    return this.findOneResult(
      async () =>
        this.query()
          .where(and(eq(feedbackMessageModel.id, messageId.value), owner))
          .limit(1),
      DrizzleFeedbackMessageMapper.toEntity,
    )
  }

  async listByReport(feedbackReportId: Id): Promise<FeedbackMessage[]> {
    const owner = this.ownerCondition()
    return this.findManyResults(
      async () =>
        this.query()
          .where(and(eq(feedbackMessageModel.reportId, feedbackReportId.value), owner))
          .orderBy(asc(feedbackMessageModel.createdAt), asc(feedbackMessageModel.id)),
      DrizzleFeedbackMessageMapper.toEntity,
    )
  }

  private assertSameMessage(
    existing: typeof feedbackMessageModel.$inferSelect,
    message: FeedbackMessage,
  ): void {
    if (
      !this.sameMessageIdentity(existing, message) ||
      existing.content !== message.content.value
    )
      throw new ConflictError('messageId já foi usado com outro conteúdo')
  }

  private sameMessageIdentity(
    existing: typeof feedbackMessageModel.$inferSelect,
    message: FeedbackMessage,
  ): boolean {
    return (
      existing.reportId === message.reportId.value &&
      existing.authorId === message.authorId.value &&
      existing.authorRole === message.authorRole.value
    )
  }

  private async insertMessage(
    transaction: DrizzleTransaction,
    message: FeedbackMessage,
    status: (typeof feedbackReportModel.$inferSelect)['status'],
  ): Promise<void> {
    if (status === 'closed') throw new ConflictError('Relatório de feedback fechado')
    await transaction
      .insert(feedbackMessageModel)
      .values(DrizzleFeedbackMessageMapper.toPersistence(message))
    await this.insertAttachments(transaction, message)
  }

  private async insertAttachments(
    transaction: DrizzleTransaction,
    message: FeedbackMessage,
  ): Promise<void> {
    const attachments = DrizzleFeedbackMessageMapper.attachmentsToPersistence(message)
    if (attachments.length)
      await transaction.insert(feedbackMessageAttachmentModel).values(attachments)
  }

  private readAttachments(transaction: DrizzleTransaction, messageId: Id) {
    return transaction
      .select()
      .from(feedbackMessageAttachmentModel)
      .where(eq(feedbackMessageAttachmentModel.messageId, messageId.value))
      .orderBy(asc(feedbackMessageAttachmentModel.position))
  }

  private assertSameAttachments(
    persisted: FeedbackMessage,
    message: FeedbackMessage,
  ): void {
    if (JSON.stringify(persisted.attachments) !== JSON.stringify(message.attachments))
      throw new ConflictError('messageId já foi usado com outros anexos')
  }

  private async lockReport(
    transaction: DrizzleTransaction,
    message: FeedbackMessage,
    owner: SQL | undefined,
  ) {
    const filter = and(eq(feedbackReportModel.id, message.reportId.value), owner)
    const [report] = await this.lockedReportQuery(transaction, filter)
    if (!report) throw new NotFoundError('Relatório de feedback não encontrado')
    return report
  }

  private lockedReportQuery(transaction: DrizzleTransaction, filter: SQL | undefined) {
    return transaction
      .select({ status: feedbackReportModel.status })
      .from(feedbackReportModel)
      .where(filter)
      .for('update')
      .limit(1)
  }

  private existingMessage(transaction: DrizzleTransaction, message: FeedbackMessage) {
    return transaction
      .select()
      .from(feedbackMessageModel)
      .where(eq(feedbackMessageModel.id, message.id.value))
      .limit(1)
  }

  private async persistMessage(
    transaction: DrizzleTransaction,
    message: FeedbackMessage,
    owner: SQL | undefined,
  ): Promise<FeedbackMessage> {
    const report = await this.lockReport(transaction, message, owner)
    const [existing] = await this.existingMessage(transaction, message)
    await this.ensureMessage(transaction, message, existing, report.status)
    return this.validatedMessage(transaction, message, existing)
  }

  private async validatedMessage(
    transaction: DrizzleTransaction,
    message: FeedbackMessage,
    existing: typeof feedbackMessageModel.$inferSelect | undefined,
  ): Promise<FeedbackMessage> {
    const persisted = await this.hydrateMessage(transaction, message, existing)
    this.assertSameAttachments(persisted, message)
    return persisted
  }

  private async ensureMessage(
    transaction: DrizzleTransaction,
    message: FeedbackMessage,
    existing: typeof feedbackMessageModel.$inferSelect | undefined,
    status: (typeof feedbackReportModel.$inferSelect)['status'],
  ): Promise<void> {
    if (existing) this.assertSameMessage(existing, message)
    else await this.insertMessage(transaction, message, status)
  }

  private async hydrateMessage(
    transaction: DrizzleTransaction,
    message: FeedbackMessage,
    existing: typeof feedbackMessageModel.$inferSelect | undefined,
  ): Promise<FeedbackMessage> {
    const attachments = await this.readAttachments(transaction, message.id)
    return DrizzleFeedbackMessageMapper.toEntity({
      ...this.persistedMessageRow(message, existing),
      feedbackMessageAttachments: attachments,
    })
  }

  private persistedMessageRow(
    message: FeedbackMessage,
    existing: typeof feedbackMessageModel.$inferSelect | undefined,
  ) {
    return (
      existing ?? {
        ...DrizzleFeedbackMessageMapper.toPersistence(message),
        createdAt: message.createdAt,
      }
    )
  }

  async add(message: FeedbackMessage): Promise<FeedbackMessage> {
    this.authorizeMessage(message)
    const owner = this.ownerCondition()
    return this.executeQuery(async () =>
      this.database.transaction(async (transaction) =>
        this.persistMessage(transaction, message, owner),
      ),
    )
  }

  private async lockMessage(transaction: DrizzleTransaction, message: FeedbackMessage) {
    const [row] = await this.lockedMessageQuery(transaction, message)
    this.assertMessageAuthor(row, message)
    return row
  }

  private messageIdentityFilter(message: FeedbackMessage) {
    return and(
      eq(feedbackMessageModel.id, message.id.value),
      eq(feedbackMessageModel.reportId, message.reportId.value),
      this.ownerCondition(),
    )
  }

  private messageReportQuery(transaction: DrizzleTransaction) {
    return transaction
      .select(getTableColumns(feedbackMessageModel))
      .from(feedbackMessageModel)
      .innerJoin(
        feedbackReportModel,
        eq(feedbackReportModel.id, feedbackMessageModel.reportId),
      )
  }

  private lockedMessageQuery(transaction: DrizzleTransaction, message: FeedbackMessage) {
    return this.messageReportQuery(transaction)
      .where(this.messageIdentityFilter(message))
      .for('update', { of: feedbackMessageModel })
      .limit(1)
  }

  private assertMessageAuthor(
    row: typeof feedbackMessageModel.$inferSelect | undefined,
    message: FeedbackMessage,
  ): asserts row is typeof feedbackMessageModel.$inferSelect {
    if (
      !row ||
      row.authorId !== message.authorId.value ||
      row.authorRole !== message.authorRole.value
    )
      throw new AuthError('Conta não autorizada')
  }

  private async persistAttachments(
    transaction: DrizzleTransaction,
    message: FeedbackMessage,
  ): Promise<void> {
    const row = await this.lockMessage(transaction, message)
    const persisted = await this.hydrateMessage(transaction, message, row)
    if (persisted.attachments.length) this.assertSameAttachments(persisted, message)
    else await this.insertAttachments(transaction, message)
  }

  async addAttachments(message: FeedbackMessage): Promise<void> {
    this.authorizeMessage(message)
    await this.executeQuery(async () => {
      await this.database.transaction(async (transaction) => {
        await this.persistAttachments(transaction, message)
      })
    })
  }
}
