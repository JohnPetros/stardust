import type { FeedbackReportsRepository } from '@stardust/core/reporting/interfaces'
import type { FeedbackReport } from '@stardust/core/reporting/entities'
import { SupabaseRepository } from '../SupabaseRepository'

export class SupabaseFeedbackReportsRepository
  extends SupabaseRepository
  implements FeedbackReportsRepository
{
  async add(report: FeedbackReport): Promise<void> {
    const { error } = await this.supabase.from('feedback_reports').insert({
      id: report.id.value,
      content: report.content.value,
      intent: report.intent.value,
      screenshot: report.screenshot?.value,
      user_id: report.author.id.value,
    })

    if (error) {
      this.handleQueryPostgresError(error)
    }
  }
}
