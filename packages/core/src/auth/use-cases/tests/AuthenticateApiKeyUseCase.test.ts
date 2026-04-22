import { mock, type Mock } from 'ts-jest-mocker'

import { ApiKeyNotFoundError } from '#auth/domain/errors/index'
import { ApiKeysFaker } from '#auth/domain/entities/fakers/ApiKeysFaker'
import type { ApiKeySecretProvider, ApiKeysRepository } from '#auth/interfaces/index'
import { AuthenticateApiKeyUseCase } from '../AuthenticateApiKeyUseCase'

describe('Authenticate Api Key Use Case', () => {
  let repository: Mock<ApiKeysRepository>
  let secretProvider: Mock<ApiKeySecretProvider>
  let useCase: AuthenticateApiKeyUseCase

  beforeEach(() => {
    repository = mock<ApiKeysRepository>()
    secretProvider = mock<ApiKeySecretProvider>()

    repository.findByHash.mockImplementation()
    secretProvider.hash.mockReturnValue('a'.repeat(64))

    useCase = new AuthenticateApiKeyUseCase(repository, secretProvider)
  })

  it('should hash the key, find by hash and return the key user id', async () => {
    const apiKey = ApiKeysFaker.fake()
    repository.findByHash.mockResolvedValue(apiKey)

    const response = await useCase.execute({ apiKey: 'sk_secret_value' })

    expect(secretProvider.hash).toHaveBeenCalledWith('sk_secret_value')
    expect(repository.findByHash).toHaveBeenCalledTimes(1)
    expect(repository.findByHash.mock.calls[0][0].value).toBe('a'.repeat(64))
    expect(response).toEqual({ userId: apiKey.userId.value })
  })

  it('should throw when api key is not found', async () => {
    repository.findByHash.mockResolvedValue(null)

    await expect(useCase.execute({ apiKey: 'sk_missing' })).rejects.toThrow(
      ApiKeyNotFoundError,
    )
  })

  it('should throw when api key is revoked', async () => {
    const apiKey = ApiKeysFaker.fake({ revokedAt: new Date() })
    repository.findByHash.mockResolvedValue(apiKey)

    await expect(useCase.execute({ apiKey: 'sk_revoked' })).rejects.toThrow(
      ApiKeyNotFoundError,
    )
  })
})
