import type { FeedbackReport } from '@stardust/core/reporting/entities'
import { FeedbackReport as FeedbackReportEntity } from '@stardust/core/reporting/entities'
import type { SupabaseFeedbackReport } from '../../types/SupabaseFeedbackReport'

export class SupabaseFeedbackReportMapper {
  static toEntity(row: SupabaseFeedbackReport): FeedbackReport {
    return FeedbackReportEntity.create({
      id: row.id,
      content: row.content,
      intent: row.intent as 'bug' | 'idea' | 'other',
      screenshot: row.screenshot ?? undefined,
      sentAt: row.created_at,
      author: {
        id: row.user_id,
        entity: {
          slug: row.users?.slug ?? '',
          name: row.users?.name ?? '',
          avatar: {
            name: row.users?.avatar?.name ?? '',
            image: row.users?.avatar?.image ?? '',
          },
        },
      },
      title: row.title,
      status: row.status as 'open' | 'closed',
      createdAt: row.created_at,
      lastActivityAt: row.last_activity_at,
      lastUserMessageAt: row.last_user_message_at ?? undefined,
      studioReadAt: row.studio_read_at ?? undefined,
      adminMessageCount:
        row.admin_message_count ?? row.feedback_messages?.[0]?.count ?? 0,
      authorEmail: row.author_email ?? row.users?.email,
      preview: row.preview ?? row.content,
      isUnread: row.is_unread,
    })
  }

  static toSupabase(report: FeedbackReport) {
    return {
      id: report.id.value,
      content: report.content.value,
      intent: report.intent.value,
      screenshot: report.screenshot?.value,
      user_id: report.author.id.value,
      created_at: report.sentAt.toISOString(),
      title: report.title.value,
      status: report.status.value,
      last_activity_at: report.lastActivityAt.toISOString(),
      last_user_message_at: report.lastUserMessageAt?.toISOString() ?? null,
      studio_read_at: report.studioReadAt?.toISOString() ?? null,
    }
  }
}
