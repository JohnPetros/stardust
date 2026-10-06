import { FeedbackMessage } from '@stardust/core/reporting/entities'
import type {
  DrizzleFeedbackMessage,
  DrizzleInsertFeedbackMessage,
} from '../../types/entities/reporting'
import type { feedbackMessageAttachmentModel } from '../../models/reporting/feedback-message-attachment-model'
export class DrizzleFeedbackMessageMapper {
  static toEntity(row: DrizzleFeedbackMessage): FeedbackMessage {
    return FeedbackMessage.create({
      ...DrizzleFeedbackMessageMapper.identity(row),
      content: row.content,
      createdAt: row.createdAt.toISOString(),
      attachments: DrizzleFeedbackMessageMapper.attachments(row),
    })
  }
  private static identity(row: DrizzleFeedbackMessage) {
    return {
      id: row.id,
      reportId: row.reportId,
      authorRole: row.authorRole as 'user' | 'admin',
      authorId: row.authorId,
    }
  }
  private static attachments(row: DrizzleFeedbackMessage) {
    return [...(row.feedbackMessageAttachments ?? [])]
      .sort((left, right) => left.position - right.position)
      .map((attachment) => ({
        id: attachment.id,
        storageKey: attachment.storageKey,
        originalName: attachment.originalName,
        mimeType: attachment.mimeType,
        size: attachment.size,
      }))
  }
  static toPersistence(message: FeedbackMessage): DrizzleInsertFeedbackMessage {
    return {
      ...DrizzleFeedbackMessageMapper.persistenceIdentity(message),
      content: message.content.value,
      createdAt: message.createdAt,
    }
  }
  private static persistenceIdentity(message: FeedbackMessage) {
    return {
      id: message.id.value,
      reportId: message.reportId.value,
      authorRole: message.authorRole.value,
      authorId: message.authorId.value,
    }
  }
  static attachmentsToPersistence(
    message: FeedbackMessage,
  ): (typeof feedbackMessageAttachmentModel.$inferInsert)[] {
    return message.attachments.map((attachment, position) => ({
      id: attachment.id,
      messageId: message.id.value,
      storageKey: attachment.storageKey,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      size: attachment.size,
      position,
    }))
  }
}
