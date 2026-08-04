import type { FeedbackMessagesRepository } from '@stardust/core/reporting/interfaces'
import type { FeedbackMessage } from '@stardust/core/reporting/entities'
import type { Id } from '@stardust/core/global/structures'
import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseFeedbackMessageMapper } from '../../mappers/reporting/SupabaseFeedbackMessageMapper'
import type { SupabaseFeedbackMessage } from '../../types/SupabaseFeedbackMessage'
import { supabase } from '../../supabase'

export class SupabaseFeedbackMessagesRepository
  extends SupabaseRepository
  implements FeedbackMessagesRepository
{
  constructor(requestSupabase?: ConstructorParameters<typeof SupabaseRepository>[0]) {
    super(requestSupabase ?? supabase)
  }

  async add(message: FeedbackMessage): Promise<FeedbackMessage> {
    const { data, error } = await this.supabase
      .from('feedback_messages')
      .upsert(SupabaseFeedbackMessageMapper.toSupabase(message), { onConflict: 'id' })
      .select('*, feedback_message_attachments(*)')
      .single()

    if (error) this.handleQueryPostgresError(error)
    return SupabaseFeedbackMessageMapper.toEntity(data as SupabaseFeedbackMessage)
  }

  async addAttachments(message: FeedbackMessage): Promise<void> {
    if (message.attachments.length === 0) return

    const { error } = await this.supabase
      .from('feedback_message_attachments')
      .insert(SupabaseFeedbackMessageMapper.attachmentsToSupabase(message))

    if (error) this.handleQueryPostgresError(error)
  }

  async findById(messageId: Id): Promise<FeedbackMessage | null> {
    const { data, error } = await this.supabase
      .from('feedback_messages')
      .select('*, feedback_message_attachments(*)')
      .eq('id', messageId.value)
      .maybeSingle()

    if (error) this.handleQueryPostgresError(error)
    return data
      ? SupabaseFeedbackMessageMapper.toEntity(data as SupabaseFeedbackMessage)
      : null
  }

  async listByReport(feedbackReportId: Id): Promise<FeedbackMessage[]> {
    const { data, error } = await this.supabase
      .from('feedback_messages')
      .select('*, feedback_message_attachments(*)')
      .eq('report_id', feedbackReportId.value)
      .order('created_at', { ascending: true })
      .order('id', { ascending: true })

    if (error) this.handleQueryPostgresError(error)
    return (data ?? []).map((row) =>
      SupabaseFeedbackMessageMapper.toEntity(row as SupabaseFeedbackMessage),
    )
  }
}
