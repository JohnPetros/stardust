import { mock, type Mock } from 'ts-jest-mocker'

import type { ApiKeySecretProvider, ApiKeysRepository } from '#auth/interfaces/index'
import { CreateApiKeyUseCase } from '../CreateApiKeyUseCase'

describe('Create Api Key Use Case', () => {
  let repository: Mock<ApiKeysRepository>
  let secretProvider: Mock<ApiKeySecretProvider>
  let useCase: CreateApiKeyUseCase

  beforeEach(() => {
    repository = mock<ApiKeysRepository>()
    secretProvider = mock<ApiKeySecretProvider>()

    repository.add.mockImplementation()
    secretProvider.generateToken.mockReturnValue(
      '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    )
    secretProvider.hash.mockReturnValue('a'.repeat(64))

    useCase = new CreateApiKeyUseCase(repository, secretProvider)
  })

  it('should generate the secret, hash it, persist the entity and return it once', async () => {
    const response = await useCase.execute({
      name: 'Minha chave',
      userId: '1fa67cc0-e4e8-4054-a8aa-9c4a81710948',
    })

    expect(secretProvider.generateToken).toHaveBeenCalledWith(32)
    expect(secretProvider.hash).toHaveBeenCalledWith(
      'sk_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    )
    expect(repository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        dto: expect.objectContaining({
          name: 'Minha chave',
          keyHash: 'a'.repeat(64),
          keyPreview: 'sk_123...cdef',
          userId: '1fa67cc0-e4e8-4054-a8aa-9c4a81710948',
        }),
      }),
    )
    expect(response).toEqual({
      id: expect.any(String),
      name: 'Minha chave',
      keyPreview: 'sk_123...cdef',
      createdAt: expect.any(Date),
      key: 'sk_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    })
  })
})
