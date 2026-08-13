import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { FeedbackReportStatus } from '../domain/structures/FeedbackReportStatus'
import type { UserFeedbackReportsPageDto } from '../domain/entities/dtos'
import type { ListUserFeedbackReportsRequest } from '../domain/types'
import type { FeedbackReportsRepository } from '../interfaces'

const DEFAULT_PAGE = 1
const DEFAULT_ITEMS_PER_PAGE = 10

export class ListUserFeedbackReportsUseCase
  implements UseCase<ListUserFeedbackReportsRequest, Promise<UserFeedbackReportsPageDto>>
{
  constructor(private readonly reports: FeedbackReportsRepository) {}

  async execute(
    request: ListUserFeedbackReportsRequest,
  ): Promise<UserFeedbackReportsPageDto> {
    const page = OrdinalNumber.create(request.page ?? DEFAULT_PAGE, 'Página')
    const itemsPerPage = OrdinalNumber.create(
      request.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE,
      'Itens por página',
    )
    const result = await this.reports.listByAuthor({
      authorId: Id.create(request.authorId),
      status: request.status ? FeedbackReportStatus.create(request.status) : undefined,
      page,
      itemsPerPage,
    })

    return {
      items: result.items.map((report) => report.dto),
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      total: result.total,
    }
  }
}
