import type { FeedbackReport } from '@stardust/core/reporting/entities'
import { FeedbackReport as FeedbackReportEntity } from '@stardust/core/reporting/entities'
import type { SupabaseFeedbackReport } from '../../types/SupabaseFeedbackReport'

export class SupabaseFeedbackReportMapper {
  static toEntity(row: SupabaseFeedbackReport): FeedbackReport {
    const authorName =
      row.users?.name && row.users.name.trim().length >= 2 ? row.users.name : 'Você'
    const authorSlug =
      row.users?.slug && row.users.slug.trim().length >= 2 ? row.users.slug : 'voce'

    return FeedbackReportEntity.create({
      id: row.id,
      content: row.content,
      intent: row.intent as 'bug' | 'idea' | 'other',
      screenshot: row.screenshot ?? undefined,
      sentAt: row.created_at,
      author: {
        id: row.user_id,
        entity: {
          slug: authorSlug,
          name: authorName,
          avatar: {
            name:
              row.users?.avatar?.name && row.users.avatar.name.trim().length >= 2
                ? row.users.avatar.name
                : authorName,
            image:
              row.users?.avatar?.image &&
              /\.(png|jpe?g|gif|svg)$/i.test(row.users.avatar.image)
                ? row.users.avatar.image
                : '/images/profile.svg',
          },
        },
      },
      title: row.title,
      status: row.status as 'open' | 'closed',
      createdAt: row.created_at,
      lastActivityAt: row.last_activity_at,
      lastUserMessageAt: row.last_user_message_at ?? undefined,
      studioReadAt: row.studio_read_at ?? undefined,
      lastAdminMessageAt: row.last_admin_message_at ?? undefined,
      authorReadAt: row.author_read_at ?? undefined,
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
      last_admin_message_at: report.lastAdminMessageAt?.toISOString() ?? null,
      author_read_at: report.authorReadAt?.toISOString() ?? null,
    }
  }
}
