import { Entity } from '#global/domain/abstracts/index'
import { AppError } from '#global/domain/errors/AppError'
import { AuthorAggregate } from '#global/domain/aggregates/AuthorAggregate'
import { Image } from '#global/domain/structures/Image'
import { Text } from '#global/domain/structures/Text'
import { FeedbackIntent } from '../structures'
import { FeedbackReportStatus } from '../structures'
import type { FeedbackReportDto } from './dtos'

type FeedbackReportProps = {
  content: Text
  screenshot?: Image
  intent: FeedbackIntent
  author: AuthorAggregate
  title: Text
  status: FeedbackReportStatus
  createdAt: Date
  lastActivityAt: Date
  lastUserMessageAt?: Date
  studioReadAt?: Date
  lastAdminMessageAt?: Date
  authorReadAt?: Date
  adminMessageCount: number
  authorEmail?: string
  preview: Text
  isUnread?: boolean
}

export class FeedbackReport extends Entity<FeedbackReportProps> {
  static create(dto: FeedbackReportDto) {
    const normalizedTitle = (dto.title ?? dto.content).trim().replace(/\s+/g, ' ')
    const title = FeedbackReport.deriveTitle(normalizedTitle)
    const adminMessageCount = dto.adminMessageCount ?? 0

    if (!Number.isInteger(adminMessageCount) || adminMessageCount < 0) {
      throw new AppError(
        'A quantidade de mensagens administrativas deve ser um número inteiro não negativo',
      )
    }

    return new FeedbackReport(
      {
        content: Text.create(dto.content),
        screenshot: dto.screenshot ? Image.create(dto.screenshot) : undefined,
        intent: FeedbackIntent.create(dto.intent),
        author: AuthorAggregate.create(dto.author),
        title: Text.create(title),
        status: FeedbackReportStatus.create(dto.status ?? 'open'),
        createdAt: new Date(dto.createdAt ?? dto.sentAt ?? Date.now()),
        lastActivityAt: new Date(
          dto.lastActivityAt ?? dto.createdAt ?? dto.sentAt ?? Date.now(),
        ),
        lastUserMessageAt: dto.lastUserMessageAt
          ? new Date(dto.lastUserMessageAt)
          : undefined,
        studioReadAt: dto.studioReadAt ? new Date(dto.studioReadAt) : undefined,
        lastAdminMessageAt: dto.lastAdminMessageAt
          ? new Date(dto.lastAdminMessageAt)
          : undefined,
        authorReadAt: dto.authorReadAt ? new Date(dto.authorReadAt) : undefined,
        adminMessageCount,
        authorEmail: dto.authorEmail,
        preview: Text.create(dto.preview ?? dto.content),
        isUnread: dto.isUnread,
      },
      dto.id,
    )
  }

  get content(): Text {
    return this.props.content
  }

  get screenshot(): Image | undefined {
    return this.props.screenshot
  }

  get intent(): FeedbackIntent {
    return this.props.intent
  }

  get author(): AuthorAggregate {
    return this.props.author
  }

  get title(): Text {
    return this.props.title
  }

  get status(): FeedbackReportStatus {
    return this.props.status
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get sentAt(): Date {
    return this.createdAt
  }

  get lastActivityAt(): Date {
    return this.props.lastActivityAt
  }

  get lastUserMessageAt(): Date | undefined {
    return this.props.lastUserMessageAt
  }

  get studioReadAt(): Date | undefined {
    return this.props.studioReadAt
  }

  get lastAdminMessageAt(): Date | undefined {
    return this.props.lastAdminMessageAt
  }

  get authorReadAt(): Date | undefined {
    return this.props.authorReadAt
  }

  get hasUnreadAdminReply(): boolean {
    return Boolean(
      this.lastAdminMessageAt &&
        (!this.authorReadAt || this.lastAdminMessageAt > this.authorReadAt),
    )
  }

  get isUnreadForStudio(): boolean {
    const derived = Boolean(
      this.lastUserMessageAt &&
        (!this.studioReadAt || this.lastUserMessageAt > this.studioReadAt),
    )
    return this.props.isUnread ?? derived
  }

  get isUnread(): boolean {
    return this.isUnreadForStudio
  }

  get adminMessageCount(): number {
    return this.props.adminMessageCount
  }

  get authorEmail(): string | undefined {
    return this.props.authorEmail
  }

  get preview(): Text {
    return this.props.preview
  }

  close(): void {
    if (this.adminMessageCount === 0) {
      throw new AppError(
        'O relatório de feedback não pode ser fechado sem uma resposta do administrador',
      )
    }
    if (this.status.isClosed.isTrue) return
    this.props.status = FeedbackReportStatus.createAsClosed()
    this.touchActivity()
  }

  reopen(): void {
    if (this.status.isOpen.isTrue) return
    this.props.status = FeedbackReportStatus.createAsOpen()
    this.touchActivity()
  }

  markStudioRead(lastSeenUserMessageAt: Date): void {
    if (!this.lastUserMessageAt || lastSeenUserMessageAt > this.lastUserMessageAt) {
      throw new AppError(
        'O registro de leitura deve referenciar uma mensagem de usuário conhecida',
      )
    }
    if (!this.studioReadAt || lastSeenUserMessageAt > this.studioReadAt) {
      this.props.studioReadAt = lastSeenUserMessageAt
    }
  }

  markAuthorRead(lastSeenAdminMessageAt: Date): void {
    if (!this.lastAdminMessageAt || lastSeenAdminMessageAt > this.lastAdminMessageAt) {
      throw new AppError(
        'O registro de leitura deve referenciar uma mensagem administrativa conhecida',
      )
    }
    if (!this.authorReadAt || lastSeenAdminMessageAt > this.authorReadAt) {
      this.props.authorReadAt = lastSeenAdminMessageAt
    }
  }

  registerActivity(createdAt: Date, authorRole: 'user' | 'admin'): void {
    if (authorRole === 'admin') this.props.adminMessageCount += 1
    if (
      authorRole === 'admin' &&
      (!this.lastAdminMessageAt || createdAt > this.lastAdminMessageAt)
    ) {
      this.props.lastAdminMessageAt = createdAt
    }
    if (
      authorRole === 'user' &&
      (!this.lastUserMessageAt || createdAt > this.lastUserMessageAt)
    ) {
      this.props.lastUserMessageAt = createdAt
    }
    if (createdAt > this.lastActivityAt) this.props.lastActivityAt = createdAt
  }

  registerMessage(authorRole: 'user' | 'admin', createdAt = new Date()): void {
    if (this.status.isClosed.isTrue) {
      throw new AppError('O relatório de feedback está fechado')
    }
    this.registerActivity(createdAt, authorRole)
  }

  private touchActivity(): void {
    const now = new Date()
    if (now > this.lastActivityAt) this.props.lastActivityAt = now
  }

  get dto(): FeedbackReportDto {
    return {
      id: this.id.value,
      content: this.content.value,
      intent: this.intent.value,
      screenshot: this.screenshot?.value,
      author: this.author.dto,
      sentAt: this.sentAt.toISOString(),
      title: this.title.value,
      status: this.status.value,
      createdAt: this.createdAt.toISOString(),
      lastActivityAt: this.lastActivityAt.toISOString(),
      lastUserMessageAt: this.lastUserMessageAt?.toISOString(),
      studioReadAt: this.studioReadAt?.toISOString(),
      lastAdminMessageAt: this.lastAdminMessageAt?.toISOString(),
      authorReadAt: this.authorReadAt?.toISOString(),
      adminMessageCount: this.adminMessageCount,
      authorEmail: this.authorEmail,
      preview: this.preview.value,
      isUnread: this.isUnread,
      hasUnreadAdminReply: this.hasUnreadAdminReply,
    }
  }

  private static deriveTitle(normalizedTitle: string): string {
    if (normalizedTitle.length <= 60) return normalizedTitle

    const candidate = normalizedTitle.slice(0, 60)
    const lastSpace = candidate.lastIndexOf(' ')
    return (lastSpace > 0 ? candidate.slice(0, lastSpace) : candidate).trim()
  }
}
