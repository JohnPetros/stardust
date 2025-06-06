import type { UseCase } from '#global/interfaces/UseCase'
import { Id, Text, OrdinalNumber } from '#global/domain/structures/index'
import type { SolutionDto } from '../domain/entities/dtos'
import { PaginationResponse } from '../../global/responses'
import type { SolutionsRepository } from '../interfaces'
import { SolutionsListingSorter } from '../domain/structures'

type Request = {
  page: number
  itemsPerPage: number
  title: string
  sorter: string
  challengeId?: string
  userId?: string
}

type Response = Promise<PaginationResponse<SolutionDto>>

export class ListSolutionsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: SolutionsRepository) {}

  async execute(request: Request) {
    const { solutions, totalSolutionsCount } = await this.repository.findMany({
      challengeId: request.challengeId ? Id.create(request.challengeId) : null,
      userId: request.userId ? Id.create(request.userId) : null,
      title: Text.create(request.title),
      sorter: SolutionsListingSorter.create(request.sorter),
      page: OrdinalNumber.create(request.page),
      itemsPerPage: OrdinalNumber.create(request.itemsPerPage),
    })

    return new PaginationResponse(
      solutions.map((solution) => solution.dto),
      totalSolutionsCount,
    )
  }
}
