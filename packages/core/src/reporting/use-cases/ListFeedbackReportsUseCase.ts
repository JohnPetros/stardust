import type { UseCase } from '#global/interfaces/UseCase'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import type { FeedbackReportDto } from '../domain/entities/dtos'
import type { FeedbackReportsRepository } from '../interfaces'
import { Text } from '#global/domain/structures/Text'
import { Period } from '#global/domain/structures/Period'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { FeedbackIntent } from '../domain/structures/FeedbackIntent'

type Request = {
  authorName?: string
  intent?: string
  sentAtStartDate?: string
  sentAtEndDate?: string
  page?: number
  itemsPerPage?: number
}

type Response = Promise<PaginationResponse<FeedbackReportDto>>

export class ListFeedbackReportsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: FeedbackReportsRepository) {}

  async execute(request: Request): Response {
    const { items, count } = await this.repository.findMany({
      authorName: request.authorName ? Text.create(request.authorName) : undefined,
      intent: request.intent ? FeedbackIntent.create(request.intent) : undefined,
      sentAtPeriod:
        request.sentAtStartDate && request.sentAtEndDate
          ? Period.create(request.sentAtStartDate, request.sentAtEndDate)
          : undefined,
      page: request.page ? OrdinalNumber.create(request.page, 'Página') : undefined,
      itemsPerPage: request.itemsPerPage
        ? OrdinalNumber.create(request.itemsPerPage, 'Itens por página')
        : undefined,
    })

    return new PaginationResponse(
      items.map((report) => report.dto),
      count,
      request.itemsPerPage,
    )
  }
}
