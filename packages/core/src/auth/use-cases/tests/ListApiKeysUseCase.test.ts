import { mock, type Mock } from 'ts-jest-mocker'

import { ApiKeysFaker } from '#auth/domain/entities/fakers/ApiKeysFaker'
import type { ApiKeysRepository } from '#auth/interfaces/index'
import { ListApiKeysUseCase } from '../ListApiKeysUseCase'

describe('List Api Keys Use Case', () => {
  let repository: Mock<ApiKeysRepository>
  let useCase: ListApiKeysUseCase

  beforeEach(() => {
    repository = mock<ApiKeysRepository>()
    repository.findManyByUserId.mockImplementation()
    useCase = new ListApiKeysUseCase(repository)
  })

  it('should return only the public api key data', async () => {
    const apiKey = ApiKeysFaker.fake()
    repository.findManyByUserId.mockResolvedValue([apiKey])

    const response = await useCase.execute({ userId: apiKey.userId.value })

    expect(repository.findManyByUserId).toHaveBeenCalledWith(apiKey.userId)
    expect(response.items).toEqual([
      {
        id: apiKey.id.value,
        name: apiKey.name.value,
        keyPreview: apiKey.keyPreview,
        createdAt: apiKey.createdAt,
      },
    ])
    expect(response.items[0]).not.toHaveProperty('keyHash')
  })
})
