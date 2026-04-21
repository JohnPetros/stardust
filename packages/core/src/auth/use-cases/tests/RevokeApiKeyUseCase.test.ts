import { mock, type Mock } from 'ts-jest-mocker'

import { ApiKeysFaker } from '#auth/domain/entities/fakers/ApiKeysFaker'
import { ApiKeyAccessDeniedError, ApiKeyNotFoundError } from '#auth/domain/errors/index'
import type { ApiKeysRepository } from '#auth/interfaces/index'
import { RevokeApiKeyUseCase } from '../RevokeApiKeyUseCase'

describe('Revoke Api Key Use Case', () => {
  let repository: Mock<ApiKeysRepository>
  let useCase: RevokeApiKeyUseCase

  beforeEach(() => {
    repository = mock<ApiKeysRepository>()
    repository.findById.mockImplementation()
    repository.revoke.mockImplementation()
    useCase = new RevokeApiKeyUseCase(repository)
  })

  it('should revoke the api key', async () => {
    const apiKey = ApiKeysFaker.fake()
    repository.findById.mockResolvedValue(apiKey)

    await useCase.execute({
      apiKeyId: apiKey.id.value,
      userId: apiKey.userId.value,
    })

    expect(repository.revoke).toHaveBeenCalledWith(apiKey.id, expect.any(Date))
  })

  it('should throw when the api key is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        apiKeyId: '5ce7b546-9d57-4841-a0a8-f68f202dc0e5',
        userId: '276f3ac5-7204-4d20-98fa-dd0863186045',
      }),
    ).rejects.toThrow(ApiKeyNotFoundError)

    expect(repository.revoke).not.toHaveBeenCalled()
  })

  it('should throw when the user does not own the api key', async () => {
    const apiKey = ApiKeysFaker.fake()
    repository.findById.mockResolvedValue(apiKey)

    await expect(
      useCase.execute({
        apiKeyId: apiKey.id.value,
        userId: 'e797961a-9b14-4f50-bfc6-027d940f97b5',
      }),
    ).rejects.toThrow(ApiKeyAccessDeniedError)

    expect(repository.revoke).not.toHaveBeenCalled()
  })

  it('should not revoke again when the api key is already revoked', async () => {
    const apiKey = ApiKeysFaker.fake({ revokedAt: new Date('2026-04-18T12:00:00Z') })
    repository.findById.mockResolvedValue(apiKey)

    await expect(
      useCase.execute({
        apiKeyId: apiKey.id.value,
        userId: apiKey.userId.value,
      }),
    ).resolves.toBeUndefined()

    expect(repository.revoke).not.toHaveBeenCalled()
  })
})
