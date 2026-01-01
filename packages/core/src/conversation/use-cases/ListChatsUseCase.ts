import type { ChatsRepository } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'
import type { ChatDto } from '../domain/entities/dtos'
import { Id } from '#global/domain/structures/Id'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Text } from '#global/domain/structures/Text'
import { PaginationResponse } from '#global/responses/PaginationResponse'

type Request = {
  userId: string
  search: string
  page: number
  itemsPerPage: number
}

type Response = Promise<PaginationResponse<ChatDto>>

export class ListChatsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChatsRepository) {}

  async execute({ userId, search, page, itemsPerPage }: Request) {
    const { items, count } = await this.repository.findManyByUser({
      userId: Id.create(userId),
      search: Text.create(search),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
    })
    return new PaginationResponse(
      items.map((chat) => chat.dto),
      count,
      itemsPerPage,
    )
  }
}
