import { mock, type Mock } from 'ts-jest-mocker'

import type { RocketsRepository } from '#shop/interfaces/RocketsRepository'
import { ListRocketsUseCase } from '../ListRocketsUseCase'
import { Text } from '#global/domain/structures/Text'
import { ListOrder } from '#global/domain/structures/ListOder'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import { RocketsFaker } from '#shop/domain/entities/fakers/RocketsFaker'

describe('List Rockets Use Case', () => {
  let repository: Mock<RocketsRepository>
  let useCase: ListRocketsUseCase

  beforeEach(() => {
    repository = mock<RocketsRepository>()
    repository.findMany.mockImplementation()
    useCase = new ListRocketsUseCase(repository)
  })

  it('should try to find many rockets', async () => {
    repository.findMany.mockResolvedValue({
      rockets: [],
      totalRocketsCount: 0,
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

  it('should return a pagination response with the found rockets', async () => {
    const rockets = RocketsFaker.fakeMany(10)
    repository.findMany.mockResolvedValue({
      rockets,
      totalRocketsCount: rockets.length,
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
        rockets.map((rocket) => rocket.dto),
        rockets.length,
        request.itemsPerPage.value,
      ),
    )
  })
})
