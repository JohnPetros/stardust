import { ListOrder } from '#global/domain/structures/ListOder'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Text } from '#global/domain/structures/Text'
import type { UseCase } from '#global/interfaces/UseCase'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import type { RocketsRepository } from '../interfaces'
import type { RocketDto } from '../dtos'

type Request = {
  search: string
  order: string
  page: number
  itemsPerPage: number
}

type Response = Promise<PaginationResponse<RocketDto>>

export class ListRocketsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: RocketsRepository) {}

  async execute({ search, order, page, itemsPerPage }: Request) {
    const { rockets, totalRocketsCount } = await this.repository.findMany({
      search: Text.create(search),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      order: ListOrder.create(order),
    })

    return new PaginationResponse(
      rockets.map((rocket) => rocket.dto),
      totalRocketsCount,
      itemsPerPage,
    )
  }
}
