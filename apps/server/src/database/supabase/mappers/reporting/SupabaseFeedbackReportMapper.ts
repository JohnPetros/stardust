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
          slug: row.users.slug,
          name: row.users.name,
          avatar: {
            name: row.users.avatar?.name ?? '',
            image: row.users.avatar?.image ?? '',
          },
        },
      },
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
    }
  }
}
