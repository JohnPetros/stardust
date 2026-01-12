import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Text } from '#global/domain/structures/Text'
import { ListingOrder } from '#global/domain/structures/ListingOrder'
import type { UseCase } from '#global/interfaces/UseCase'
import type { AvatarsRepository } from '../interfaces'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import type { AvatarDto } from '../domain/entities/dtos'

type Request = {
  search: string
  priceOrder: string
  page: number
  itemsPerPage: number
}

type Response = Promise<PaginationResponse<AvatarDto>>

export class ListAvatarsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AvatarsRepository) {}

  async execute({ search, priceOrder, page, itemsPerPage }: Request) {
    const { items, count } = await this.repository.findMany({
      search: Text.create(search),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      priceOrder: ListingOrder.create(priceOrder),
    })

    return new PaginationResponse(
      items.map((avatar) => avatar.dto),
      count,
      itemsPerPage,
    )
  }
}
