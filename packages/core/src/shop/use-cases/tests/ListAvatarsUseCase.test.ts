import { mock, type Mock } from 'ts-jest-mocker'

import type { AvatarsRepository } from '#shop/interfaces/AvatarsRepository'
import { ListAvatarsUseCase } from '../ListAvatarsUseCase'
import { Text } from '#global/domain/structures/Text'
import { ListOrder } from '#global/domain/structures/ListOder'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import { AvatarsFaker } from '#shop/domain/entities/fakers/AvatarsFaker'

describe('List Avatars Use Case', () => {
  let repository: Mock<AvatarsRepository>
  let useCase: ListAvatarsUseCase

  beforeEach(() => {
    repository = mock<AvatarsRepository>()
    repository.findMany.mockImplementation()
    useCase = new ListAvatarsUseCase(repository)
  })

  it('should try to find many avatars', async () => {
    repository.findMany.mockResolvedValue({
      avatars: [],
      totalAvatarsCount: 0,
    })
    const request = {
      search: Text.create(''),
      order: ListOrder.create('ascending'),
      page: OrdinalNumber.create(1),
      itemsPerPage: OrdinalNumber.create(10),
    }

    await useCase.execute({
      search: request.search.value,
      page: request.page.value,
      order: request.order.value,
      itemsPerPage: request.itemsPerPage.value,
    })

    expect(repository.findMany).toHaveBeenCalledWith(request)
  })

  it('should return a pagination response with the found avatars', async () => {
    const avatars = AvatarsFaker.fakeMany(10)
    repository.findMany.mockResolvedValue({
      avatars,
      totalAvatarsCount: avatars.length,
    })
    const request = {
      search: Text.create(''),
      order: ListOrder.create('ascending'),
      page: OrdinalNumber.create(1),
      itemsPerPage: OrdinalNumber.create(10),
    }

    const response = await useCase.execute({
      search: request.search.value,
      page: request.page.value,
      order: request.order.value,
      itemsPerPage: request.itemsPerPage.value,
    })

    expect(response).toBeInstanceOf(PaginationResponse)
    expect(response).toEqual(
      new PaginationResponse(
        avatars.map((avatar) => avatar.dto),
        avatars.length,
        request.itemsPerPage.value,
      ),
    )
  })
})
