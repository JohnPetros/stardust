import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Text } from '#global/domain/structures/Text'
import type { UseCase } from '#global/interfaces/UseCase'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import type { UserDto } from '../domain/entities/dtos'
import type { UsersRepository } from '../interfaces'

type Request = {
  search: string
  page: number
  itemsPerPage: number
}

type Response = Promise<PaginationResponse<UserDto>>

export class ListUsersUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ search, page, itemsPerPage }: Request) {
    const { items, count } = await this.repository.findMany({
      search: Text.create(search),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
    })

    return new PaginationResponse(
      items.map((user) => user.dto),
      count,
      itemsPerPage,
    )
  }
}
