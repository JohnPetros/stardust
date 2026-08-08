import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { FeedbackReportNotFoundError } from '../domain/errors'
import type { FeedbackMessagesRepository, FeedbackReportsRepository } from '../interfaces'
import type { MarkFeedbackReportAsReadRequest } from '../domain/types'

export class MarkFeedbackReportAsReadUseCase
  implements UseCase<MarkFeedbackReportAsReadRequest, Promise<void>>
{
  constructor(
    private readonly reports: FeedbackReportsRepository,
    private readonly messages: FeedbackMessagesRepository,
  ) {}

  async execute(request: MarkFeedbackReportAsReadRequest): Promise<void> {
    const reportId = Id.create(request.feedbackReportId)
    const isLegacyRequest = 'lastSeenUserMessageId' in request
    const actor = isLegacyRequest
      ? { accountId: undefined, role: 'admin' as const }
      : request.actor
    const lastSeenMessageId = isLegacyRequest
      ? request.lastSeenUserMessageId
      : request.lastSeenMessageId
    const report =
      actor.role === 'user'
        ? await this.reports.findByIdAndAuthor(reportId, Id.create(actor.accountId))
        : await this.reports.findById(reportId)
    if (!report) throw new FeedbackReportNotFoundError()
    const message = await this.messages.findById(Id.create(lastSeenMessageId))
    if (
      !message ||
      message.reportId.value !== report.id.value ||
      (actor.role === 'user'
        ? !message.authorRole.isAdmin.value
        : !message.authorRole.isUser.value)
    ) {
      throw new FeedbackReportNotFoundError()
    }

    if (actor.role === 'user') {
      report.markAuthorRead(message.createdAt)
    }

    if (isLegacyRequest) {
      // The administrative route from the previous reporting contract is kept
      // source-compatible until the Server adapter migrates to the participant
      // aware port.
      await (
        this.reports.markAsRead as unknown as (
          feedbackReportId: Id,
          lastSeenMessageAt: Date,
        ) => Promise<void>
      )(report.id, message.createdAt)
      return
    }

    await this.reports.markAsRead({
      feedbackReportId: report.id,
      participant: actor.role === 'user' ? 'author' : 'studio',
      lastSeenMessageAt: message.createdAt,
      authorId: actor.role === 'user' ? Id.create(actor.accountId) : undefined,
    })
  }
}
