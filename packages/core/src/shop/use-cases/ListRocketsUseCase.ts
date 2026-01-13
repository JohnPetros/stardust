import { ListingOrder } from '#global/domain/structures/ListingOrder'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Text } from '#global/domain/structures/Text'
import type { UseCase } from '#global/interfaces/UseCase'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import type { RocketsRepository } from '../interfaces'
import type { RocketDto } from '../domain/entities/dtos'

type Request = {
  search: string
  priceOrder: string
  page: number
  itemsPerPage: number
}

type Response = Promise<PaginationResponse<RocketDto>>

export class ListRocketsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: RocketsRepository) {}

  async execute({ search, priceOrder, page, itemsPerPage }: Request) {
    const { items, count } = await this.repository.findMany({
      search: Text.create(search),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      priceOrder: ListingOrder.create(priceOrder),
    })

    return new PaginationResponse(
      items.map((rocket) => rocket.dto),
      count,
      itemsPerPage,
    )
  }
}
