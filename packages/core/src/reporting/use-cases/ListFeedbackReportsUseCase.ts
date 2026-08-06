import type { UseCase } from '#global/interfaces/UseCase'
import type { FeedbackReportsPageDto } from '../domain/entities/dtos'
import type { FeedbackReportsRepository } from '../interfaces'
import { Text } from '#global/domain/structures/Text'
import { Period } from '#global/domain/structures/Period'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { FeedbackIntent } from '../domain/structures/FeedbackIntent'
import { FeedbackReportStatus } from '../domain/structures/FeedbackReportStatus'

type Request = {
  authorName?: string
  intent?: string
  sentAtStartDate?: string
  sentAtEndDate?: string
  page?: number
  itemsPerPage?: number
  search?: string
  status?: 'open' | 'closed'
  createdAtStartDate?: string
  createdAtEndDate?: string
}

type Response = Promise<FeedbackReportsPageDto>

export class ListFeedbackReportsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: FeedbackReportsRepository) {}

  async execute(request: Request): Response {
    return this.repository.list({
      search:
        request.search || request.authorName
          ? Text.create(request.search ?? request.authorName!)
          : undefined,
      intent: request.intent ? FeedbackIntent.create(request.intent) : undefined,
      status: request.status ? FeedbackReportStatus.create(request.status) : undefined,
      createdAtPeriod:
        request.sentAtStartDate && request.sentAtEndDate
          ? Period.create(request.sentAtStartDate, request.sentAtEndDate)
          : undefined,
      page: request.page ? OrdinalNumber.create(request.page, 'Página') : undefined,
      itemsPerPage: request.itemsPerPage
        ? OrdinalNumber.create(request.itemsPerPage, 'Itens por página')
        : undefined,
    })
  }
}
