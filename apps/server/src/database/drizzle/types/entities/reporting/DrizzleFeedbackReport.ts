import type { feedbackReportModel } from '../../../models/reporting/feedback-report-model'
import type { userModel } from '../../../models/profile/user-model'
import type { avatarModel } from '../../../models/shop/avatar-model'

export type DrizzleFeedbackReport = typeof feedbackReportModel.$inferSelect & {
  adminMessageCount?: number
  feedbackMessages?: { count: number }[]
  users?:
    | (Pick<typeof userModel.$inferSelect, 'name' | 'slug'> &
        Partial<Pick<typeof userModel.$inferSelect, 'email'>> & {
          avatar: Pick<typeof avatarModel.$inferSelect, 'image' | 'name'> | null
        })
    | null
  preview?: string
  isUnread?: boolean
  authorEmail?: (typeof userModel.$inferSelect)['email']
}

export type DrizzleInsertFeedbackReport = typeof feedbackReportModel.$inferInsert
