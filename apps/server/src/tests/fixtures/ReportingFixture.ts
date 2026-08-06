import type { SupabaseClient } from '@supabase/supabase-js'

import type {
  FeedbackMessageDto,
  FeedbackReportDto,
} from '@stardust/core/reporting/entities/dtos'
import { FeedbackMessage, FeedbackReport } from '@stardust/core/reporting/entities'
import { Id } from '@stardust/core/global/structures'

import {
  SupabaseFeedbackMessagesRepository,
  SupabaseFeedbackReportsRepository,
} from '@/database/supabase/repositories/reporting'

import { LocalSupabaseProxy } from './LocalSupabaseProxy'

export class ReportingFixture {
  private readonly repository: SupabaseFeedbackReportsRepository
  private readonly messagesRepository: SupabaseFeedbackMessagesRepository

  constructor(private readonly supabase: SupabaseClient) {
    this.repository = new SupabaseFeedbackReportsRepository(supabase)
    this.messagesRepository = new SupabaseFeedbackMessagesRepository(supabase)
  }

  async clearFeedbackReports() {
    await LocalSupabaseProxy.ensureRunning()

    const { error } = await this.supabase
      .from('feedback_reports')
      .delete()
      .not('id', 'is', null)

    if (error) {
      throw error
    }
  }

  async createFeedbackReport(reportDto: FeedbackReportDto) {
    const report = FeedbackReport.create(reportDto)

    await this.repository.add(report)

    return report.dto
  }

  async createFeedbackReports(reportsDto: FeedbackReportDto[]) {
    return Promise.all(
      reportsDto.map((reportDto) => this.createFeedbackReport(reportDto)),
    )
  }

  async findFeedbackReportById(feedbackId: string) {
    const report = await this.repository.findById(Id.create(feedbackId))

    return report?.dto ?? null
  }

  async listFeedbackReports() {
    const { items } = await this.repository.findMany({})

    return items.map((item) => item.dto)
  }

  async createFeedbackMessage(messageDto: FeedbackMessageDto) {
    const message = await this.messagesRepository.add(FeedbackMessage.create(messageDto))
    return message.dto
  }

  async listFeedbackMessages(feedbackReportId: string) {
    const messages = await this.messagesRepository.listByReport(
      Id.create(feedbackReportId),
    )
    return messages.map((message) => message.dto)
  }
}
