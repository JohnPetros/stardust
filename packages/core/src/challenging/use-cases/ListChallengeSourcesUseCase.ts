import type { ChallengeSourceDto } from '../domain/entities/dtos'
import type { ChallengeSourcesRepository } from '../interfaces'
import { Text, ListingOrder, OrdinalNumber } from '#global/domain/structures/index'
import { PaginationResponse } from '../../global/responses'
import type { UseCase } from '#global/interfaces/UseCase'

type Request = {
  page: number
  itemsPerPage: number
  title: string
}

type Response = Promise<PaginationResponse<ChallengeSourceDto>>

export class ListChallengeSourcesUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengeSourcesRepository) {}

  async execute({ page, itemsPerPage, title }: Request): Response {
    const response = await this.repository.findMany({
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      title: Text.create(title),
      positionOrder: ListingOrder.createAsAscending(),
    })

    return new PaginationResponse(
      response.items.map((challengeSource) => challengeSource.dto),
      response.count,
      itemsPerPage,
    )
  }
}
