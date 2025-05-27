import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { Text } from '#global/domain/structures/Text'
import { ListOrder } from '#global/domain/structures/ListOder'
import type { UseCase } from '#global/interfaces/UseCase'
import type { AvatarsRepository } from '../interfaces'
import { PaginationResponse } from '#global/responses/PaginationResponse'

type Request = {
  search: string
  order: string
  page: number
  itemsPerPage: number
}

export class ListAvatarsUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: AvatarsRepository) {}

  async execute({ search, order, page, itemsPerPage }: Request) {
    const { avatars, totalAvatarsCount } = await this.repository.findMany({
      search: Text.create(search),
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(itemsPerPage),
      order: ListOrder.create(order),
    })

    return new PaginationResponse(
      avatars.map((avatar) => avatar.dto),
      totalAvatarsCount,
      itemsPerPage,
    )
  }
}
