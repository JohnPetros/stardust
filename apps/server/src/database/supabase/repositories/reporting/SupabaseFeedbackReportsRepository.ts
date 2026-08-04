import type { FeedbackReportsRepository } from '@stardust/core/reporting/interfaces'
import { FeedbackReport } from '@stardust/core/reporting/entities'
import type { FeedbackReportsListingParams } from '@stardust/core/reporting/types'
import type { ManyItems } from '@stardust/core/global/types'
import { Email } from '@stardust/core/global/structures'
import type { Id } from '@stardust/core/global/structures'
import type { FeedbackReportsPageDto } from '@stardust/core/reporting/entities/dtos'
import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseFeedbackReportMapper } from '../../mappers/reporting/SupabaseFeedbackReportMapper'
import type { SupabaseFeedbackReport } from '../../types'
import { supabase } from '../../supabase'
import type { FeedbackReportStatus } from '@stardust/core/reporting/structures'
import type { Json } from '../../types/Database'

type FeedbackReportsRpcRow = Omit<SupabaseFeedbackReport, 'id'> & {
  id: string | null
  admin_message_count: number
  total_count: number
  is_unread: boolean
  author_name: string
  author_email: string
  author_slug: string
  avatar_name: string | null
  avatar_image: string | null
  summary_total: number
  summary_open: number
  summary_closed: number
  summary_unread: number
  preview: string
}

export class SupabaseFeedbackReportsRepository
  extends SupabaseRepository
  implements FeedbackReportsRepository
{
  constructor(requestSupabase?: SupabaseFeedbackReportRepositoryClient) {
    super(requestSupabase ?? supabase)
  }

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
      query = query.eq('intent', params.intent.value as SupabaseFeedbackReport['intent'])
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

  async list(params: FeedbackReportsListingParams): Promise<FeedbackReportsPageDto> {
    const { data, error } = await this.supabase.rpc('list_feedback_reports', {
      p_search: params.search?.value ?? params.authorName?.value ?? null,
      p_intent: params.intent?.value as SupabaseFeedbackReport['intent'] | null,
      p_status: params.status?.value ?? null,
      p_created_at_start:
        (params.createdAtPeriod ?? params.sentAtPeriod)?.startDate.toISOString() ?? null,
      p_created_at_end:
        (params.createdAtPeriod ?? params.sentAtPeriod)?.endDate.toISOString() ?? null,
      p_page: params.page?.value ?? 1,
      p_items_per_page: params.itemsPerPage?.value ?? 20,
    })
    if (error) this.handleQueryPostgresError(error)

    const rows = (data ?? []) as unknown as FeedbackReportsRpcRow[]
    const metadata = rows[0]
    const items = rows.filter((row) => row.id !== null)

    return {
      items: items.map(
        (row) =>
          SupabaseFeedbackReportMapper.toEntity({
            ...row,
            users: {
              name: row.author_name,
              email: row.author_email,
              slug: row.author_slug,
              avatar: row.avatar_name
                ? { name: row.avatar_name, image: row.avatar_image ?? '' }
                : null,
            },
            author_email: row.author_email,
            preview: row.preview,
            is_unread: row.is_unread,
          } as unknown as SupabaseFeedbackReport).dto,
      ),
      page: params.page?.value ?? 1,
      itemsPerPage: params.itemsPerPage?.value ?? 20,
      total: metadata?.total_count ?? 0,
      summary: {
        total: metadata?.summary_total ?? 0,
        open: metadata?.summary_open ?? 0,
        closed: metadata?.summary_closed ?? 0,
        unread: metadata?.summary_unread ?? 0,
      },
    }
  }

  async findAuthorEmail(feedbackReportId: Id): Promise<Email | null> {
    const { data, error } = await this.supabase
      .from('feedback_reports')
      .select('users!inner(email)')
      .eq('id', feedbackReportId.value)
      .maybeSingle()

    if (error) this.handleQueryPostgresError(error)
    const email = (data as { users?: { email?: string } } | null)?.users?.email
    return email ? (Email.create(email) as Email) : null
  }

  async add(report: FeedbackReport): Promise<void> {
    const supabaseReport = SupabaseFeedbackReportMapper.toSupabase(report)

    const { error } = await this.supabase.from('feedback_reports').insert(supabaseReport)

    if (error) {
      this.handleQueryPostgresError(error)
    }
  }

  async save(report: FeedbackReport): Promise<void> {
    const { error } = await this.supabase
      .from('feedback_reports')
      .update(SupabaseFeedbackReportMapper.toSupabase(report))
      .eq('id', report.id.value)

    if (error) this.handleQueryPostgresError(error)
  }

  async changeStatus(
    report: FeedbackReport,
    expectedStatus: FeedbackReportStatus,
  ): Promise<FeedbackReport> {
    const { data, error } = await this.supabase.rpc('change_feedback_report_status', {
      p_request: {
        reportId: report.id.value,
        expectedStatus: expectedStatus.value,
        status: report.status.value,
      } as unknown as Json,
    })
    if (error) this.handleQueryPostgresError(error)
    const result = data as unknown as Record<string, unknown>
    return FeedbackReport.create({
      ...report.dto,
      status: String(result.status) as 'open' | 'closed',
      lastActivityAt: String(result.last_activity_at),
    })
  }

  async findById(feedbackId: Id): Promise<FeedbackReport | null> {
    const { data, error } = await this.supabase
      .from('feedback_reports')
      .select(
        '*, users(name, slug, avatar:avatar_id(name, image)), feedback_messages!feedback_messages_report_id_fkey(count)',
      )
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

  async markAsRead(feedbackReportId: Id, lastSeenUserMessageAt: Date): Promise<void> {
    const { error } = await this.supabase
      .from('feedback_reports')
      .update({ studio_read_at: lastSeenUserMessageAt.toISOString() })
      .eq('id', feedbackReportId.value)
      .or(
        `studio_read_at.is.null,studio_read_at.lt.${lastSeenUserMessageAt.toISOString()}`,
      )

    if (error) this.handleQueryPostgresError(error)
  }
}

type SupabaseFeedbackReportRepositoryClient = ConstructorParameters<
  typeof SupabaseRepository
>[0]
