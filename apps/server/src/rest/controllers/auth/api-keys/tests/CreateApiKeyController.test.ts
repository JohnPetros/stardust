import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type {
  ApiKeySecretProvider,
  ApiKeysRepository,
} from '@stardust/core/auth/interfaces'
import { CreateApiKeyUseCase } from '@stardust/core/auth/use-cases'
import { CreateApiKeyController } from '../CreateApiKeyController'

describe('Create Api Key Controller', () => {
  let http: Mock<Http<{ body: { name: string } }>>
  let repository: Mock<ApiKeysRepository>
  let secretProvider: Mock<ApiKeySecretProvider>
  let controller: CreateApiKeyController

  beforeEach(() => {
    http = mock()
    repository = mock()
    secretProvider = mock()
    controller = new CreateApiKeyController(repository, secretProvider)
    http.statusCreated.mockReturnValue(http)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract the request, call the use case and return created status', async () => {
    const restResponse = mock<RestResponse>()
    const response = {
      id: 'api-key-id',
      name: 'Minha chave',
      keyPreview: 'sk_123...cdef',
      createdAt: new Date('2026-04-18T12:00:00Z'),
      key: 'sk_secret',
    }

    http.getBody.mockResolvedValue({ name: 'Minha chave' })
    http.getAccountId.mockResolvedValue('account-id')
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(CreateApiKeyUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const result = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({
      name: 'Minha chave',
      userId: 'account-id',
    })
    expect(http.statusCreated).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(response)
    expect(result).toBe(restResponse)
  })
})
