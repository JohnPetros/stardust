import { FeedbackMessage } from '@stardust/core/reporting/entities'
import type { FeedbackMessageDto } from '@stardust/core/reporting/entities/dtos'
import type { SupabaseFeedbackMessage } from '../../types/SupabaseFeedbackMessage'

export class SupabaseFeedbackMessageMapper {
  static toEntity(row: SupabaseFeedbackMessage): FeedbackMessage {
    return FeedbackMessage.create(SupabaseFeedbackMessageMapper.toDto(row))
  }

  static toDto(row: SupabaseFeedbackMessage): FeedbackMessageDto {
    return {
      id: row.id,
      reportId: row.report_id,
      authorRole: row.author_role as 'user' | 'admin',
      authorId: row.author_id,
      content: row.content,
      createdAt: row.created_at,
      attachments: (row.feedback_message_attachments ?? [])
        .sort((left, right) => left.position - right.position)
        .map((attachment) => ({
          id: attachment.id,
          storageKey: attachment.storage_key,
          originalName: attachment.original_name,
          mimeType: attachment.mime_type,
          size: attachment.size,
        })),
    }
  }

  static toSupabase(message: FeedbackMessage) {
    return {
      id: message.id.value,
      report_id: message.reportId.value,
      author_role: message.authorRole.value,
      author_id: message.authorId.value,
      content: message.content.value,
      created_at: message.createdAt.toISOString(),
    }
  }

  static attachmentsToSupabase(message: FeedbackMessage) {
    return message.attachments.map((attachment, position) => ({
      id: attachment.id,
      message_id: message.id.value,
      storage_key: attachment.storageKey,
      original_name: attachment.originalName,
      mime_type: attachment.mimeType,
      size: attachment.size,
      position,
    }))
  }
}
