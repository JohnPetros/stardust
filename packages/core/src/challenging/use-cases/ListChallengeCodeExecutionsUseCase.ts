import { Id, OrdinalNumber } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/index'
import { PaginationResponse } from '#global/responses/index'
import type { ChallengeCodeExecutionDto } from '../domain/structures/dtos'
import type { ChallengeCodeExecutionsRepository } from '../interfaces'

type Request = {
  userId: string
  challengeId: string
  page: number
  itemsPerPage: number
}

type Response = Promise<PaginationResponse<ChallengeCodeExecutionDto>>

export class ListChallengeCodeExecutionsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChallengeCodeExecutionsRepository) {}

  async execute(request: Request): Response {
    const { items, count } = await this.repository.findManyByUserAndChallenge({
      userId: Id.create(request.userId),
      challengeId: Id.create(request.challengeId),
      page: OrdinalNumber.create(request.page),
      itemsPerPage: OrdinalNumber.create(request.itemsPerPage),
    })

    return new PaginationResponse({
      items: items.map((execution) => execution.dto),
      totalItemsCount: count,
      page: request.page,
      itemsPerPage: request.itemsPerPage,
    })
  }
}
