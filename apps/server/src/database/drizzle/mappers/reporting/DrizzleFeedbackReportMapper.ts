import { FeedbackReport } from '@stardust/core/reporting/entities'
import type {
  DrizzleFeedbackReport,
  DrizzleInsertFeedbackReport,
} from '../../types/entities/reporting'
export class DrizzleFeedbackReportMapper {
  static toEntity(row: DrizzleFeedbackReport): FeedbackReport {
    return FeedbackReport.create({
      ...DrizzleFeedbackReportMapper.content(row),
      author: DrizzleFeedbackReportMapper.author(row),
      ...DrizzleFeedbackReportMapper.lifecycle(row),
      ...DrizzleFeedbackReportMapper.conversationSummary(row),
    })
  }
  private static conversationSummary(row: DrizzleFeedbackReport) {
    return {
      ...DrizzleFeedbackReportMapper.activity(row),
      ...DrizzleFeedbackReportMapper.readState(row),
      authorEmail: row.authorEmail ?? row.users?.email,
      preview: row.preview ?? row.content,
    }
  }
  private static content({
    id,
    content,
    intent,
    screenshot,
    createdAt,
  }: DrizzleFeedbackReport) {
    return {
      id,
      content,
      intent,
      screenshot: screenshot ?? undefined,
      sentAt: createdAt.toISOString(),
    }
  }
  private static lifecycle(row: DrizzleFeedbackReport) {
    return {
      title: row.title,
      status: row.status as 'open' | 'closed',
      createdAt: row.createdAt.toISOString(),
    }
  }
  private static activity(row: DrizzleFeedbackReport) {
    return {
      lastActivityAt: row.lastActivityAt.toISOString(),
      lastUserMessageAt: row.lastUserMessageAt?.toISOString(),
      lastAdminMessageAt: row.lastAdminMessageAt?.toISOString(),
    }
  }
  private static readState(row: DrizzleFeedbackReport) {
    return {
      studioReadAt: row.studioReadAt?.toISOString(),
      authorReadAt: row.authorReadAt?.toISOString(),
      adminMessageCount: row.adminMessageCount ?? row.feedbackMessages?.[0]?.count ?? 0,
      isUnread: row.isUnread,
    }
  }
  private static author(row: DrizzleFeedbackReport) {
    return {
      id: row.userId,
      entity: DrizzleFeedbackReportMapper.authorProfile(row),
    }
  }

  private static authorProfile(row: DrizzleFeedbackReport) {
    const name = displayText(row.users?.name, 'Você')
    return {
      name,
      slug: displayText(row.users?.slug, 'voce'),
      avatar: authorAvatar(row.users?.avatar, name),
    }
  }

  static toPersistence(report: FeedbackReport): DrizzleInsertFeedbackReport {
    return {
      ...DrizzleFeedbackReportMapper.persistenceContent(report),
      ...DrizzleFeedbackReportMapper.persistenceLifecycle(report),
      ...DrizzleFeedbackReportMapper.persistenceActivity(report),
      ...DrizzleFeedbackReportMapper.persistenceReadState(report),
    }
  }
  private static persistenceContent(report: FeedbackReport) {
    return {
      id: report.id.value,
      content: report.content.value,
      intent: report.intent.value,
      screenshot: report.screenshot?.value ?? null,
    }
  }
  private static persistenceLifecycle(report: FeedbackReport) {
    return {
      userId: report.author.id.value,
      createdAt: report.createdAt,
      title: report.title.value,
      status: report.status.value,
    }
  }
  private static persistenceActivity(report: FeedbackReport) {
    return {
      lastActivityAt: report.lastActivityAt,
      lastUserMessageAt: report.lastUserMessageAt ?? null,
      lastAdminMessageAt: report.lastAdminMessageAt ?? null,
    }
  }
  private static persistenceReadState(report: FeedbackReport) {
    return {
      studioReadAt: report.studioReadAt ?? null,
      authorReadAt: report.authorReadAt ?? null,
    }
  }
}

function displayText(value: string | null | undefined, fallback: string) {
  return value && value.trim().length >= 2 ? value : fallback
}
function authorAvatar(
  avatar: NonNullable<DrizzleFeedbackReport['users']>['avatar'] | undefined,
  name: string,
) {
  return {
    name: displayText(avatar?.name, name),
    image:
      avatar?.image && /\.(png|jpe?g|gif|svg)$/i.test(avatar.image)
        ? avatar.image
        : '/images/profile.svg',
  }
}
