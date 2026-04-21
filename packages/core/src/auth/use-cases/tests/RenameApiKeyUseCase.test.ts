import { mock, type Mock } from 'ts-jest-mocker'

import { ApiKeysFaker } from '#auth/domain/entities/fakers/ApiKeysFaker'
import { ApiKeyAccessDeniedError, ApiKeyNotFoundError } from '#auth/domain/errors/index'
import type { ApiKeysRepository } from '#auth/interfaces/index'
import { RenameApiKeyUseCase } from '../RenameApiKeyUseCase'

describe('Rename Api Key Use Case', () => {
  let repository: Mock<ApiKeysRepository>
  let useCase: RenameApiKeyUseCase

  beforeEach(() => {
    repository = mock<ApiKeysRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new RenameApiKeyUseCase(repository)
  })

  it('should rename the api key', async () => {
    const apiKey = ApiKeysFaker.fake({ name: 'Nome antigo' })
    repository.findById.mockResolvedValue(apiKey)

    const response = await useCase.execute({
      apiKeyId: apiKey.id.value,
      name: 'Nome novo',
      userId: apiKey.userId.value,
    })

    expect(repository.replace).toHaveBeenCalledWith(apiKey)
    expect(apiKey.name.value).toBe('Nome novo')
    expect(response).toEqual({
      id: apiKey.id.value,
      name: 'Nome novo',
      keyPreview: apiKey.keyPreview,
      createdAt: apiKey.createdAt,
    })
  })

  it('should throw when the api key is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        apiKeyId: 'd45668e5-e56a-4f61-86aa-4ad77c784e7e',
        name: 'Nome novo',
        userId: 'c1332d5d-5093-4139-9685-31f6b2576d9e',
      }),
    ).rejects.toThrow(ApiKeyNotFoundError)

    expect(repository.replace).not.toHaveBeenCalled()
  })

  it('should throw when the api key is already revoked', async () => {
    const apiKey = ApiKeysFaker.fake({ revokedAt: new Date('2026-04-18T12:00:00Z') })
    repository.findById.mockResolvedValue(apiKey)

    await expect(
      useCase.execute({
        apiKeyId: apiKey.id.value,
        name: 'Nome novo',
        userId: apiKey.userId.value,
      }),
    ).rejects.toThrow(ApiKeyNotFoundError)

    expect(repository.replace).not.toHaveBeenCalled()
  })

  it('should throw when the user does not own the api key', async () => {
    const apiKey = ApiKeysFaker.fake()
    repository.findById.mockResolvedValue(apiKey)

    await expect(
      useCase.execute({
        apiKeyId: apiKey.id.value,
        name: 'Nome novo',
        userId: 'd5ddb0eb-a478-446c-8e4b-c334b22d9280',
      }),
    ).rejects.toThrow(ApiKeyAccessDeniedError)

    expect(repository.replace).not.toHaveBeenCalled()
  })
})
