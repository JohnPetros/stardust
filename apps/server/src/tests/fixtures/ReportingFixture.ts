import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import type { SupabaseClient } from '@supabase/supabase-js'

import type {
  FeedbackMessageDto,
  FeedbackReportDto,
} from '@stardust/core/reporting/entities/dtos'
import { FeedbackMessage, FeedbackReport } from '@stardust/core/reporting/entities'
import { Id } from '@stardust/core/global/structures'

import {
  DrizzleFeedbackMessagesRepository,
  DrizzleFeedbackReportsRepository,
} from '@/database/drizzle/repositories/reporting'

import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import {
  feedbackReportModel,
  feedbackMessageModel,
} from '@/database/drizzle/models/reporting'

export class ReportingFixture {
  private readonly repository: DrizzleFeedbackReportsRepository
  private readonly messagesRepository: DrizzleFeedbackMessagesRepository

  private readonly database = DrizzleClient.getInstance()

  constructor(_supabase: SupabaseClient) {
    this.repository = new DrizzleFeedbackReportsRepository(this.database, {
      kind: 'system',
    })
    this.messagesRepository = new DrizzleFeedbackMessagesRepository(this.database, {
      kind: 'system',
    })
  }

  async createReportForAuthor(authorId: string) {
    const id = randomUUID()
    await this.database.insert(feedbackReportModel).values({
      id,
      userId: authorId,
      content: 'Persisted feedback for an actual route',
      intent: 'bug',
      title: 'Persisted report',
      status: 'open',
      lastActivityAt: new Date(),
    })
    return id
  }

  async createAdministrativeReply(reportId: string, authorId: string) {
    const id = randomUUID()
    const createdAt = new Date(Date.now() - 1000)
    await this.database.insert(feedbackMessageModel).values({
      id,
      reportId,
      authorRole: 'admin',
      authorId,
      content: 'A canonical administrative reply',
      createdAt,
    })
    await this.database
      .update(feedbackReportModel)
      .set({ lastAdminMessageAt: createdAt })
      .where(eq(feedbackReportModel.id, reportId))
    return { id, createdAt }
  }

  async createUserReply(reportId: string, authorId: string) {
    const id = randomUUID()
    const createdAt = new Date(Date.now() - 1000)
    await this.database.insert(feedbackMessageModel).values({
      id,
      reportId,
      authorRole: 'user',
      authorId,
      content: 'A persisted user message',
      createdAt,
    })
    await this.database
      .update(feedbackReportModel)
      .set({ lastUserMessageAt: createdAt })
      .where(eq(feedbackReportModel.id, reportId))
    return { id, createdAt }
  }

  async clearFeedbackReports() {
    await this.database.delete(feedbackReportModel)
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
