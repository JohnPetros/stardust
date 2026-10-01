import type { FeedbackMessage } from '@stardust/core/reporting/entities'
import { FeedbackMessage as FeedbackMessageEntity } from '@stardust/core/reporting/entities'
import type { FeedbackMessagesRepository } from '@stardust/core/reporting/interfaces'
import type { FeedbackMessageDto } from '@stardust/core/reporting/entities/dtos'
import type { Id } from '@stardust/core/global/structures'

import { type PostgresClient, postgresClient } from './PostgresClient'

type MessageRow = {
  id: string
  report_id: string
  author_role: 'user' | 'admin'
  author_id: string
  content: string
  created_at: Date | string
}

type AttachmentRow = {
  id: string
  storage_key: string
  original_name: string
  mime_type: 'image/png' | 'image/jpeg'
  size: number | string
  position: number
}

const toDto = (row: MessageRow, attachments: AttachmentRow[]): FeedbackMessageDto => ({
  id: row.id,
  reportId: row.report_id,
  authorRole: row.author_role,
  authorId: row.author_id,
  content: row.content,
  createdAt:
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : new Date(row.created_at).toISOString(),
  attachments: attachments
    .sort((left, right) => left.position - right.position)
    .map((attachment) => ({
      id: attachment.id,
      storageKey: attachment.storage_key,
      originalName: attachment.original_name,
      mimeType: attachment.mime_type,
      size: Number(attachment.size),
    })),
})

export class PostgresFeedbackMessagesRepository implements FeedbackMessagesRepository {
  constructor(private readonly client: PostgresClient = postgresClient) {}

  async add(message: FeedbackMessage): Promise<FeedbackMessage> {
    const rows = await this.client.query<MessageRow>`
      insert into public.feedback_messages (id, report_id, author_role, author_id, content, created_at)
      values (
        ${message.id.value}, ${message.reportId.value}, ${message.authorRole.value},
        ${message.authorId.value}, ${message.content.value}, ${message.createdAt.toISOString()}
      )
      on conflict (id) do update set
        report_id = excluded.report_id,
        author_role = excluded.author_role,
        author_id = excluded.author_id,
        content = excluded.content,
        created_at = excluded.created_at
      returning id, report_id, author_role, author_id, content, created_at
    `
    const row = rows[0]
    if (!row) throw new Error('A mensagem de feedback não foi persistida')
    return FeedbackMessageEntity.create(toDto(row, await this.getAttachments(row.id)))
  }

  async addAttachments(message: FeedbackMessage): Promise<void> {
    for (const [position, attachment] of message.attachments.entries()) {
      await this.client.query`
        insert into public.feedback_message_attachments (
          id, message_id, storage_key, original_name, mime_type, size, position
        ) values (
          ${attachment.id}, ${message.id.value}, ${attachment.storageKey},
          ${attachment.originalName}, ${attachment.mimeType}, ${attachment.size}, ${position}
        )
        on conflict (id) do update set
          message_id = excluded.message_id,
          storage_key = excluded.storage_key,
          original_name = excluded.original_name,
          mime_type = excluded.mime_type,
          size = excluded.size,
          position = excluded.position
      `
    }
  }

  async findById(messageId: Id): Promise<FeedbackMessage | null> {
    const rows = await this.client.query<MessageRow>`
      select id, report_id, author_role, author_id, content, created_at
      from public.feedback_messages where id = ${messageId.value} limit 1
    `
    const row = rows[0]
    return row
      ? FeedbackMessageEntity.create(toDto(row, await this.getAttachments(row.id)))
      : null
  }

  async listByReport(feedbackReportId: Id): Promise<FeedbackMessage[]> {
    const rows = await this.client.query<MessageRow>`
      select id, report_id, author_role, author_id, content, created_at
      from public.feedback_messages
      where report_id = ${feedbackReportId.value}
      order by created_at asc, id asc
    `
    const messages: FeedbackMessage[] = []
    for (const row of rows) {
      messages.push(
        FeedbackMessageEntity.create(toDto(row, await this.getAttachments(row.id))),
      )
    }
    return messages
  }

  private getAttachments(messageId: string): Promise<AttachmentRow[]> {
    return this.client.query<AttachmentRow>`
      select id, storage_key, original_name, mime_type, size, position
      from public.feedback_message_attachments
      where message_id = ${messageId}
      order by position asc
    `
  }
}
