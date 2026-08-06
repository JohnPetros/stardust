import { Entity } from '#global/domain/abstracts/index'
import { AppError } from '#global/domain/errors/AppError'
import { Id, Text } from '#global/domain/structures/index'
import { FeedbackMessageAuthorRole } from '../structures/FeedbackMessageAuthorRole'
import type { FeedbackMessageDto } from './dtos'

export type FeedbackMessageAttachment = FeedbackMessageDto['attachments'][number]

type FeedbackMessageProps = {
  reportId: Id
  authorRole: FeedbackMessageAuthorRole
  authorId: Id
  content: Text
  createdAt: Date
  attachments: FeedbackMessageAttachment[]
}

export class FeedbackMessage extends Entity<FeedbackMessageProps> {
  static create(dto: FeedbackMessageDto) {
    const content = dto.content.trim()
    if (content.length < 1 || content.length > 2000) {
      throw new AppError('O conteúdo da mensagem deve conter entre 1 e 2.000 caracteres')
    }
    if (dto.attachments.length > 3) {
      throw new AppError('Uma mensagem aceita no máximo três anexos')
    }

    for (const attachment of dto.attachments) {
      if (!['image/png', 'image/jpeg'].includes(attachment.mimeType)) {
        throw new AppError('Os anexos da mensagem devem ser imagens PNG ou JPEG')
      }
      if (attachment.size < 1 || attachment.size > 10 * 1024 * 1024) {
        throw new AppError('Os anexos da mensagem devem ter entre 1 byte e 10 MB')
      }
    }

    return new FeedbackMessage(
      {
        reportId: Id.create(dto.reportId),
        authorRole: FeedbackMessageAuthorRole.create(dto.authorRole),
        authorId: Id.create(dto.authorId),
        content: Text.create(content),
        createdAt: new Date(dto.createdAt ?? Date.now()),
        attachments: dto.attachments.map((attachment) => ({
          id: attachment.id,
          storageKey: attachment.storageKey,
          originalName: attachment.originalName,
          mimeType: attachment.mimeType,
          size: attachment.size,
        })),
      },
      dto.id,
    )
  }

  get reportId() {
    return this.props.reportId
  }
  get authorRole() {
    return this.props.authorRole
  }
  get authorId() {
    return this.props.authorId
  }
  get content() {
    return this.props.content
  }
  get createdAt() {
    return this.props.createdAt
  }
  get attachments() {
    return this.props.attachments
  }

  get dto(): FeedbackMessageDto {
    return {
      id: this.id.value,
      reportId: this.reportId.value,
      authorRole: this.authorRole.value,
      authorId: this.authorId.value,
      content: this.content.value,
      createdAt: this.createdAt.toISOString(),
      attachments: this.attachments,
    }
  }
}
