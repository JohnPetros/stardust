import type { FeedbackReportsRepository } from '@stardust/core/reporting/interfaces'
import type { FeedbackReport } from '@stardust/core/reporting/entities'
import type { FeedbackReportsListingParams } from '@stardust/core/reporting/types'
import type { ManyItems } from '@stardust/core/global/types'
import type { Id } from '@stardust/core/global/structures'
import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseFeedbackReportMapper } from '../../mappers/reporting/SupabaseFeedbackReportMapper'
import type { SupabaseFeedbackReport } from '../../types'

export class SupabaseFeedbackReportsRepository
  extends SupabaseRepository
  implements FeedbackReportsRepository
{
  async findMany(
    params: FeedbackReportsListingParams,
  ): Promise<ManyItems<FeedbackReport>> {
    let query = this.supabase
      .from('feedback_reports')
      .select('*, users!inner(name, slug, avatar:avatar_id(name, image))', {
        count: 'exact',
      })

    if (params.authorName) {
      query = query.ilike('users.name', `%${params.authorName.value}%`)
    }

    if (params.intent) {
      query = query.eq('intent', params.intent.value as 'bug' | 'idea' | 'other')
    }

    if (params.sentAtPeriod) {
      query = query
        .gte('created_at', params.sentAtPeriod.startDate.toISOString())
        .lte('created_at', params.sentAtPeriod.endDate.toISOString())
    }

    if (params.page && params.itemsPerPage) {
      const { from, to } = this.calculateQueryRange(
        params.page.value,
        params.itemsPerPage.value,
      )
      query = query.range(from, to)
    }

    const { data, count, error } = await query.order('created_at', { ascending: false })

    if (error) {
      this.handleQueryPostgresError(error)
    }

    return {
      items: (data || []).map((row) =>
        SupabaseFeedbackReportMapper.toEntity(row as unknown as SupabaseFeedbackReport),
      ),
      count: count || 0,
    }
  }

  async add(report: FeedbackReport): Promise<void> {
    const supabaseReport = SupabaseFeedbackReportMapper.toSupabase(report)

    const { error } = await this.supabase.from('feedback_reports').insert(supabaseReport)

    if (error) {
      this.handleQueryPostgresError(error)
    }
  }

  async findById(feedbackId: Id): Promise<FeedbackReport | null> {
    const { data, error } = await this.supabase
      .from('feedback_reports')
      .select('*, users(name, slug, avatar:avatar_id(name, image))')
      .eq('id', feedbackId.value)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      this.handleQueryPostgresError(error)
    }

    return SupabaseFeedbackReportMapper.toEntity(
      data as unknown as SupabaseFeedbackReport,
    )
  }

  async remove(feedbackId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('feedback_reports')
      .delete()
      .eq('id', feedbackId.value)

    if (error) {
      this.handleQueryPostgresError(error)
    }
  }
}
