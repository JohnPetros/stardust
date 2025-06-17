import type { UseCase } from '#global/interfaces/UseCase'
import { Id, OrdinalNumber } from '#global/domain/structures/index'
import { ListingOrder } from '#global/domain/structures/ListingOrder'
import type { CommentsRepository } from '../interfaces/CommentsRepository'
import { CommentsListSorter } from '../domain/structures/CommentsListSorter'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import type { CommentDto } from '../domain/entities/dtos'

type Request = {
  solutionId: string
  sorter: string
  order: string
  page: number
  itemsPerPage: number
}

type Response = Promise<PaginationResponse<CommentDto>>

export class ListSolutionCommentsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: CommentsRepository) {}

  async execute({ solutionId, sorter, order, page, itemsPerPage }: Request) {
    const { comments, totalCommentsCount } = await this.repository.findManyBySolution(
      Id.create(solutionId),
      {
        sorter: CommentsListSorter.create(sorter),
        order: ListingOrder.create(order),
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
      },
    )

    return new PaginationResponse(
      comments.map((comment) => comment.dto),
      totalCommentsCount,
      itemsPerPage,
    )
  }
}
